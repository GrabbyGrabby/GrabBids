'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { normalizeUrl, getDisplayUrl, getFullUrl, getFaviconUrl } from '@/lib/utils'
import type { Listing } from '@/types/database'

const MIN_BID_CENTS = parseInt(process.env.MIN_BID_CENTS ?? '100', 10)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export type SubmitResult =
  | { success: true; checkoutUrl: string }
  | { success: false; error: string }

export interface SubmitFormData {
  rawUrl: string
  title: string
  description: string
  category: string
  amountCents: number
  submitterEmail?: string
}

/**
 * Main Server Action: submit or boost a listing.
 * All submission data is encoded in Stripe metadata — no pending_submissions table needed.
 * The DB rank is ONLY updated after the webhook confirms payment.
 */
export async function submitOrBoostListing(data: SubmitFormData): Promise<SubmitResult> {
  // 1. Validate
  if (!data.rawUrl?.trim()) return { success: false, error: 'URL or handle is required' }
  if (!data.title?.trim()) return { success: false, error: 'Title is required' }
  if (!data.description?.trim()) return { success: false, error: 'Description is required' }
  if (!data.category?.trim()) return { success: false, error: 'Category is required' }
  if (data.amountCents < MIN_BID_CENTS) {
    return { success: false, error: `Minimum bid is $${MIN_BID_CENTS / 100}` }
  }

  const supabase = createServiceClient()

  // 2. Normalize URL and check for existing listing
  const normalizedUrl = normalizeUrl(data.rawUrl)
  const displayUrl = getDisplayUrl(data.rawUrl)

  const { data: existing } = await supabase
    .from('listings')
    .select('id, total_bid_cents, display_url')
    .eq('url', normalizedUrl)
    .maybeSingle()

  const isNewListing = !existing

  // 3. Create Stripe Checkout session — embed ALL data in metadata
  //    (avoids needing a pending_submissions table)
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: data.submitterEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: data.amountCents,
            product_data: {
              name: isNewListing
                ? `Submit "${data.title}" to GrabBids`
                : `Boost "${existing!.display_url}" on GrabBids`,
              description: isNewListing
                ? `New listing: ${displayUrl}`
                : `Boost from $${(existing!.total_bid_cents / 100).toFixed(0)} → +$${(data.amountCents / 100).toFixed(0)}`,
            },
          },
          quantity: 1,
        },
      ],
      // All submission data lives here — webhook reads this to write the DB
      metadata: {
        url: normalizedUrl,
        display_url: displayUrl,
        title: data.title.trim().slice(0, 80),
        description: data.description.trim().slice(0, 200),
        category: data.category,
        amount_cents: String(data.amountCents),
        is_new_listing: isNewListing ? 'true' : 'false',
        listing_id: existing?.id ?? '',
        submitter_email: data.submitterEmail?.trim() ?? '',
      },
      success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/?cancelled=true`,
    })

    return { success: true, checkoutUrl: session.url! }
  } catch (err) {
    console.error('Stripe session creation failed:', err)
    return { success: false, error: 'Payment setup failed. Please try again.' }
  }
}

/**
 * Fetch the full leaderboard (all categories, sorted by rank)
 */
export async function getLeaderboard(category?: string): Promise<Listing[]> {
  const supabase = createServiceClient()

  let query = supabase
    .from('listings')
    .select('*')
    .order('total_bid_cents', { ascending: false })
    .order('first_bid_at', { ascending: true })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query.limit(200)

  if (error) {
    console.error('Failed to fetch leaderboard:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return []
  }

  return (data ?? []) as Listing[]
}

/**
 * Get the current #1 listing bid amount (for the "Claim #1 for $X" hero)
 */
export async function getTopBidAmount(): Promise<number> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('listings')
    .select('total_bid_cents')
    .order('total_bid_cents', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data?.total_bid_cents ?? 0
}

/**
 * Get leaderboard stats
 */
export async function getLeaderboardStats(): Promise<{
  totalListings: number
  totalBidsCents: number
}> {
  const supabase = createServiceClient()
  const { data } = await supabase.from('listings').select('total_bid_cents')

  const totalListings = data?.length ?? 0
  const totalBidsCents = data?.reduce((sum, l) => sum + l.total_bid_cents, 0) ?? 0

  return { totalListings, totalBidsCents }
}

/**
 * Get listing URL for click redirect (/go/[id] route)
 */
export async function getListingUrl(listingId: string): Promise<string | null> {
  const supabase = createServiceClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('url, click_count')
    .eq('id', listingId)
    .single()

  if (!listing) return null

  // Increment click count (non-blocking)
  supabase
    .from('listings')
    .update({ click_count: listing.click_count + 1 })
    .eq('id', listingId)
    .then()

  return getFullUrl(listing.url)
}
