'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, MousePointerClick, TrendingUp } from 'lucide-react'
import { formatCurrency, timeAgo } from '@/lib/utils'
import type { Listing } from '@/types/database'

interface LeaderboardTableProps {
  listings: Listing[]
  activeCategory: string
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-400 text-white shadow-amber-200 shadow-md ring-2 ring-amber-300',
  2: 'bg-gray-300 text-gray-700 ring-2 ring-gray-200',
  3: 'bg-orange-300 text-white ring-2 ring-orange-200',
}

const CARD_RANK_STYLES: Record<number, string> = {
  1: 'border-amber-200 bg-gradient-to-r from-amber-50/80 to-white',
  2: 'border-gray-200 bg-white',
  3: 'border-orange-100 bg-gradient-to-r from-orange-50/50 to-white',
}

export default function LeaderboardTable({ listings, activeCategory }: LeaderboardTableProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">🏆</p>
        <p className="font-semibold text-gray-600">No listings yet{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}</p>
        <p className="text-sm mt-1">Be the first to claim the #1 spot!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {listings.map((listing, index) => {
          const rank = index + 1
          const rankStyle = RANK_STYLES[rank] ?? 'bg-gray-100 text-gray-500'
          const cardStyle = CARD_RANK_STYLES[rank] ?? 'border-gray-100 bg-white'

          return (
            <motion.div
              key={listing.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className={`relative border rounded-2xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow group ${cardStyle}`}
            >
              {/* Rank badge */}
              <div className="flex-shrink-0 pt-0.5">
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-black ${rankStyle}`}
                >
                  #{rank}
                </span>
              </div>

              {/* Favicon */}
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                  {listing.favicon_url ? (
                    <Image
                      src={listing.favicon_url}
                      alt={listing.display_url}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="text-lg">🌐</span>
                  )}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <a
                    href={`/go/${listing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-gray-900 hover:text-[#e85d26] transition-colors text-base leading-snug group-hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {listing.title || listing.display_url}
                  </a>
                </div>

                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{listing.description}</p>

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    #{rank} in <strong className="text-gray-600">{listing.category}</strong>
                  </span>
                  <span>·</span>
                  <span>{listing.display_url}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3" />
                    {listing.click_count.toLocaleString()} clicks
                  </span>
                  <span>·</span>
                  <span>{timeAgo(listing.last_bid_at)}</span>
                </div>
              </div>

              {/* Right: bid amount + boost CTA */}
              <div className="flex-shrink-0 flex flex-col items-end gap-2 ml-2">
                <span className="font-black text-gray-900 text-lg leading-none">
                  {formatCurrency(listing.total_bid_cents)}
                </span>

                <a
                  href={`/?url=${encodeURIComponent(listing.url)}`}
                  className="text-xs text-[#e85d26] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:underline whitespace-nowrap"
                >
                  Boost <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* #1 claim banner */}
              {rank === 1 && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  <span className="bg-[#e85d26] text-white text-[10px] font-bold px-3 py-0.5 rounded-b-lg whitespace-nowrap">
                    claim this rank for {formatCurrency(listing.total_bid_cents)}+
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
