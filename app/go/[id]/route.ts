import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getFullUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServiceClient()

  // Look up the listing
  const { data: listing } = await supabase
    .from('listings')
    .select('id, url, display_url, click_count')
    .eq('id', id)
    .maybeSingle()

  if (!listing) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Increment click count (fire and forget — don't block the redirect)
  supabase
    .from('listings')
    .update({ click_count: listing.click_count + 1 })
    .eq('id', id)
    .then()

  const destination = getFullUrl(listing.url)
  return NextResponse.redirect(destination, { status: 302 })
}
