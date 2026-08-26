export type ListingCategory =
  | 'AI Agents & Infrastructure'
  | 'SEO & AI Visibility'
  | 'Marketing & Advertising'
  | 'Crypto, Web3 & Investing'
  | 'Developer Tools'
  | 'Business, Finance & Legal'
  | 'Security, Privacy & Compliance'
  | 'Design & Creative'
  | 'Education & Learning'
  | 'Health & Wellness'
  | 'General'

export const CATEGORIES: ListingCategory[] = [
  'AI Agents & Infrastructure',
  'SEO & AI Visibility',
  'Marketing & Advertising',
  'Crypto, Web3 & Investing',
  'Developer Tools',
  'Business, Finance & Legal',
  'Security, Privacy & Compliance',
  'Design & Creative',
  'Education & Learning',
  'Health & Wellness',
  'General',
]

export const CATEGORY_ICONS: Record<ListingCategory, string> = {
  'AI Agents & Infrastructure': '🤖',
  'SEO & AI Visibility': '🔍',
  'Marketing & Advertising': '📣',
  'Crypto, Web3 & Investing': '₿',
  'Developer Tools': '</>',
  'Business, Finance & Legal': '💼',
  'Security, Privacy & Compliance': '🔒',
  'Design & Creative': '🎨',
  'Education & Learning': '📚',
  'Health & Wellness': '💪',
  'General': '⭐',
}

export interface Listing {
  id: string
  url: string
  display_url: string
  title: string
  description: string
  category: ListingCategory
  favicon_url: string | null
  total_bid_cents: number
  click_count: number
  first_bid_at: string
  last_bid_at: string
  created_at: string
}

export interface Transaction {
  id: string
  listing_id: string
  stripe_session_id: string
  stripe_payment_intent: string | null
  amount_cents: number
  submitter_email: string | null
  status: 'pending' | 'paid' | 'failed'
  created_at: string
  paid_at: string | null
}

export interface PendingSubmission {
  id: string
  stripe_session_id: string | null
  listing_id: string | null
  url: string | null
  display_url: string | null
  title: string | null
  description: string | null
  category: string | null
  submitter_email: string | null
  amount_cents: number
  is_new_listing: boolean
  created_at: string
  expires_at: string
}
