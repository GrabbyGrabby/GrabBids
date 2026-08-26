import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Webhook } from 'standardwebhooks'
import { createServiceClient } from '@/lib/supabase/server'
import { getFaviconUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()

  const webhookSignature = headersList.get('webhook-signature')
  const webhookId = headersList.get('webhook-id')
  const webhookTimestamp = headersList.get('webhook-timestamp')

  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY || process.env.DODO_WEBHOOK_SECRET

  if (!webhookKey) {
    console.error('Dodo Webhook: missing DODO_PAYMENTS_WEBHOOK_KEY environment variable')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // 1. Verify standard webhook signature if headers exist
  let event: any
  try {
    if (webhookSignature) {
      const wh = new Webhook(webhookKey)
      const rawHeaders: Record<string, string> = {
        'webhook-signature': webhookSignature,
      }
      if (webhookId) rawHeaders['webhook-id'] = webhookId
      if (webhookTimestamp) rawHeaders['webhook-timestamp'] = webhookTimestamp

      event = wh.verify(body, rawHeaders)
    } else {
      event = JSON.parse(body)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown signature error'
    console.error('Dodo Webhook verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  // 2. Only handle successful payment events
  const eventType = event.type || event.event_type
  if (eventType !== 'payment.succeeded') {
    return NextResponse.json({ received: true, ignored: true })
  }

  const paymentData = event.data || {}
  const meta = paymentData.metadata || {}
  const paymentId = paymentData.payment_id || paymentData.id || `dodo_${Date.now()}`
  const customerEmail = paymentData.customer?.email || meta.submitter_email

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
  const amountCents = parseInt(meta.amount_cents ?? paymentData.total_amount ?? paymentData.amount ?? '0', 10)

  if (!url || !amountCents) {
    console.error('Dodo Webhook: missing required metadata', meta)
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    // 3. Idempotency — don't process same payment twice
    const { data: existingTx } = await supabase
      .from('transactions')
      .select('id')
      .eq('stripe_session_id', paymentId)
      .maybeSingle()

    if (existingTx) {
      console.log('Dodo Webhook: already processed payment', paymentId)
      return NextResponse.json({ received: true })
    }

    let resolvedListingId: string

    if (isNewListing) {
      // 4a. Try to insert a new listing
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
        // Handle race condition or unique constraint conflict
        console.log('Dodo Webhook: insert conflict, boosting existing instead:', url)
        const { data: race } = await supabase
          .from('listings')
          .select('id, total_bid_cents')
          .eq('url', url)
          .single()

        if (!race) {
          console.error('Dodo Webhook: insert failed and no listing found', insertError)
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
      // 4b. Boost existing listing
      const targetId = listing_id || undefined
      if (!targetId) {
        console.error('Dodo Webhook: boost missing listing_id in metadata')
        return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 })
      }

      const { data: current } = await supabase
        .from('listings')
        .select('id, total_bid_cents')
        .eq('id', targetId)
        .single()

      if (!current) {
        console.error('Dodo Webhook: listing not found for boost', targetId)
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

    // 5. Record immutable transaction log
    await supabase.from('transactions').insert({
      listing_id: resolvedListingId,
      stripe_session_id: paymentId,
      stripe_payment_intent: paymentId,
      amount_cents: amountCents,
      submitter_email: customerEmail ?? submitter_email ?? null,
      status: 'paid',
      paid_at: new Date().toISOString(),
    })

    // 6. Bust the leaderboard cache
    revalidatePath('/')

    console.log(`Dodo Webhook: ✅ processed ${isNewListing ? 'NEW listing' : 'BOOST'} for ${url} (+$${amountCents / 100})`)
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Dodo Webhook processing error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
