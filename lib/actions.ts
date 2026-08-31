'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { dodo } from '@/lib/dodo'
import { normalizeUrl, getDisplayUrl, getFullUrl, getFaviconUrl } from '@/lib/utils'
import type { Listing } from '@/types/database'

const MIN_BID_CENTS = parseInt(process.env.MIN_BID_CENTS ?? '100', 10)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const PRODUCT_ID = process.env.DODO_PAYMENTS_PRODUCT_ID ?? 'pdt_0NmDHO3zIVN2k2NnSrHHo'

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
 * All submission data is encoded in Dodo metadata — no pending_submissions table needed.
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

  // 3. Create Dodo Payments Checkout session
  try {
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: PRODUCT_ID,
          quantity: 1,
          amount: data.amountCents,
        },
      ],
      customer: data.submitterEmail
        ? {
            email: data.submitterEmail.trim(),
            name: data.title.trim().slice(0, 50),
          }
        : undefined,
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
      return_url: `${APP_URL}/success`,
      cancel_url: `${APP_URL}/?cancelled=true`,
    })

    if (!session.checkout_url) {
      throw new Error('No checkout_url returned by Dodo Payments')
    }

    return { success: true, checkoutUrl: session.checkout_url }
  } catch (err) {
    console.error('Dodo Payments checkout creation failed:', err)
    return { success: false, error: 'Payment setup failed. Please check Dodo Payments configuration.' }
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
