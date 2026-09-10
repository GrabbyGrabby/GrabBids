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
  upvotes: number
  total_bid_cents: number
  click_count: number
  first_bid_at: string
  last_bid_at: string
  created_at: string
}
