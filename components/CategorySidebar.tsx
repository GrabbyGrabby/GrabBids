'use client'

import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Listing, ListingCategory } from '@/types/database'
import { Sparkles, Layers } from 'lucide-react'

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
    <div className="glass-card rounded-[26px] p-3.5 border border-white/5 sticky top-24 shadow-xl">
      <div className="px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-slate-500 flex items-center gap-1.5 mb-1.5">
        <Layers className="w-3.5 h-3.5 text-[#ff5e1e]" />
        <span>Categories</span>
      </div>

      <nav className="space-y-1.5">
        {categories.map((cat) => {
          const isAll = cat === 'All'
          const isActive = cat === activeCategory
          const topBid = isAll ? globalMax : categoryTotals[cat]
          const icon = icons[cat as ListingCategory] ?? '⭐'

          return (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 group active:scale-[0.985] ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff5e1e] to-[#e0480b] text-white shadow-lg shadow-[#ff5e1e]/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <span className="text-sm leading-none">{isAll ? '🔥' : icon}</span>
                <span className="truncate">{cat}</span>
              </span>
              {topBid > 0 && (
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-medium ml-1.5 flex-shrink-0 ${
                    isActive ? 'bg-black/25 text-white' : 'bg-white/[0.04] text-slate-500 group-hover:text-slate-400'
                  }`}
                >
                  {formatCurrency(topBid)}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

