'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import type { Listing, ListingCategory } from '@/types/database'

interface CategorySidebarProps {
  categories: string[]
  icons: Record<string, string>
  activeCategory: string
  listings: Listing[]
}

export default function CategorySidebar({
  categories,
  icons,
  activeCategory,
  listings,
}: CategorySidebarProps) {
  // Calculate top bid per category
  const categoryTotals: Record<string, number> = {}
  for (const listing of listings) {
    if (!categoryTotals[listing.category] || listing.total_bid_cents > categoryTotals[listing.category]) {
      categoryTotals[listing.category] = listing.total_bid_cents
    }
  }

  // Global max for "All"
  const globalMax = listings.reduce((max, l) => Math.max(max, l.total_bid_cents), 0)

  return (
    <nav className="space-y-1 sticky top-20">
      {categories.map((cat) => {
        const isAll = cat === 'All'
        const isActive = cat === activeCategory
        const topBid = isAll ? globalMax : categoryTotals[cat]
        const icon = icons[cat as ListingCategory] ?? '⭐'

        return (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors group ${
              isActive
                ? 'bg-[#e85d26] text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <span className="text-base leading-none">{isAll ? '🏆' : icon}</span>
              <span className="truncate">{cat}</span>
            </span>
            {topBid > 0 && (
              <span
                className={`text-xs font-medium ml-2 flex-shrink-0 ${
                  isActive ? 'text-white/80' : 'text-gray-400'
                }`}
              >
                {formatCurrency(topBid)}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
