import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { getFaviconUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // 1. Verify Stripe HMAC signature — only trust events that pass this
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  // 2. Only handle completed checkout sessions
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true })
  }

  // 3. Read all submission data from Stripe metadata (no DB lookup needed)
  const meta = session.metadata ?? {}
  const {
    url,
    display_url,
    title,
    description,
    category,
    listing_id,
    submitter_email,
  } = meta

  const isNewListing = meta.is_new_listing === 'true'
  const amountCents = parseInt(meta.amount_cents ?? '0', 10)

  if (!url || !amountCents) {
    console.error('Webhook: missing required metadata', meta)
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    // 4. Idempotency — don't process same session twice
    const { data: existingTx } = await supabase
      .from('transactions')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle()

    if (existingTx) {
      console.log('Webhook: already processed session', session.id)
      return NextResponse.json({ received: true })
    }

    let resolvedListingId: string

    if (isNewListing) {
      // 5a. Try to insert a new listing
      const { data: newListing, error: insertError } = await supabase
        .from('listings')
        .insert({
          url,
          display_url: display_url ?? url,
          title: title ?? '',
          description: description ?? '',
          category: category ?? 'General',
          favicon_url: display_url ? getFaviconUrl(display_url) : null,
          total_bid_cents: amountCents,
          click_count: 0,
          first_bid_at: new Date().toISOString(),
          last_bid_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (insertError) {
        // Race condition: URL already exists — fall through to boost it
        console.log('Webhook: insert conflict (race), boosting instead:', url)
        const { data: race } = await supabase
          .from('listings')
          .select('id, total_bid_cents')
          .eq('url', url)
          .single()

        if (!race) {
          console.error('Webhook: insert failed and no existing listing found', insertError)
          return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
        }

        await supabase
          .from('listings')
          .update({
            total_bid_cents: race.total_bid_cents + amountCents,
            last_bid_at: new Date().toISOString(),
          })
          .eq('id', race.id)

        resolvedListingId = race.id
      } else {
        resolvedListingId = newListing!.id
      }
    } else {
      // 5b. Boost existing listing
      const targetId = listing_id || undefined
      if (!targetId) {
        console.error('Webhook: boost missing listing_id in metadata')
        return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 })
      }

      const { data: current } = await supabase
        .from('listings')
        .select('id, total_bid_cents')
        .eq('id', targetId)
        .single()

      if (!current) {
        console.error('Webhook: listing not found for boost', targetId)
        return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
      }

      await supabase
        .from('listings')
        .update({
          total_bid_cents: current.total_bid_cents + amountCents,
          last_bid_at: new Date().toISOString(),
        })
        .eq('id', current.id)

      resolvedListingId = current.id
    }

    // 6. Record immutable transaction log
    await supabase.from('transactions').insert({
      listing_id: resolvedListingId,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent as string | null,
      amount_cents: amountCents,
      submitter_email: session.customer_email ?? submitter_email ?? null,
      status: 'paid',
      paid_at: new Date().toISOString(),
    })

    // 7. Bust the leaderboard cache
    revalidatePath('/')

    console.log(`Webhook: ✅ processed ${isNewListing ? 'NEW listing' : 'BOOST'} for ${url} (+$${amountCents / 100})`)
    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
