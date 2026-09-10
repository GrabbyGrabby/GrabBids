'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, MousePointerClick, TrendingUp, Zap, Crown, Award, Medal } from 'lucide-react'
import { formatCurrency, timeAgo } from '@/lib/utils'
import type { Listing } from '@/types/database'

interface LeaderboardTableProps {
  listings: Listing[]
  activeCategory: string
}

export default function LeaderboardTable({ listings, activeCategory }: LeaderboardTableProps) {
  if (listings.length === 0) {
    return (
      <div className="glass-card rounded-[28px] p-16 text-center border border-white/5">
        <div className="w-16 h-16 rounded-[22px] bg-white/[0.03] border border-white/10 flex items-center justify-center text-3xl mx-auto mb-4">
          🏆
        </div>
        <h3 className="text-lg font-bold text-white mb-1.5">
          No rankings yet {activeCategory !== 'All' ? `in ${activeCategory}` : ''}
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          Be the first to claim the coveted #1 position and direct high-intent traffic to your product.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      <AnimatePresence mode="popLayout">
        {listings.map((listing, index) => {
          const rank = index + 1
          const isRank1 = rank === 1
          const isRank2 = rank === 2
          const isRank3 = rank === 3

          return (
            <motion.div
              key={listing.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative glass-card rounded-[26px] p-5 sm:p-5.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4.5 transition-all duration-300 ${
                isRank1
                  ? 'border-amber-400/40 bg-gradient-to-r from-amber-500/[0.08] via-[#141724]/95 to-[#0e1019]/95 shadow-[0_12px_36px_-10px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/25'
                  : isRank2
                  ? 'border-slate-300/25 bg-gradient-to-r from-slate-300/[0.03] to-[#0e1019]/90'
                  : isRank3
                  ? 'border-amber-700/25 bg-gradient-to-r from-amber-800/[0.03] to-[#0e1019]/90'
                  : ''
              }`}
            >
              {/* #1 Supreme Rank Floating Pill */}
              {isRank1 && (
                <div className="absolute -top-3 left-7 z-10">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md shadow-amber-500/25 flex items-center gap-1.5 border border-amber-300/40">
                    <Crown className="w-3 h-3 fill-slate-950" />
                    <span>Supreme Rank</span>
                  </span>
                </div>
              )}

              {/* Left group: Rank + Icon + Details */}
              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                {/* Rank Indicator */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-11 h-11 rounded-[16px] flex items-center justify-center font-black text-sm border transition-transform group-hover:scale-105 duration-200 ${
                      isRank1
                        ? 'bg-amber-400/15 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-400/20'
                        : isRank2
                        ? 'bg-slate-300/10 text-slate-200 border-slate-300/30'
                        : isRank3
                        ? 'bg-amber-700/15 text-amber-400 border-amber-600/30'
                        : 'bg-white/[0.03] text-slate-400 border-white/5'
                    }`}
                  >
                    {isRank1 ? (
                      <Crown className="w-5 h-5 text-amber-300 fill-amber-300/30" />
                    ) : isRank2 ? (
                      <Medal className="w-5 h-5 text-slate-300" />
                    ) : isRank3 ? (
                      <Award className="w-5 h-5 text-amber-500" />
                    ) : (
                      <span className="font-mono text-xs">#{rank}</span>
                    )}
                  </div>
                </div>

                {/* Favicon Container */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-[18px] bg-[#0b0d14] border border-white/10 overflow-hidden flex items-center justify-center p-2 group-hover:border-white/20 transition-all shadow-inner">
                    {listing.favicon_url ? (
                      <Image
                        src={listing.favicon_url}
                        alt={listing.display_url}
                        width={36}
                        height={36}
                        className="w-full h-full object-contain rounded-sm"
                        unoptimized
                      />
                    ) : (
                      <span className="text-xl">🌐</span>
                    )}
                  </div>
                </div>

                {/* Meta details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`/go/${listing.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-white group-hover:text-[#ff5e1e] transition-colors text-base leading-snug truncate flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="truncate">{listing.title || listing.display_url}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 leading-relaxed">
                    {listing.description}
                  </p>

                  <div className="flex items-center gap-2.5 mt-2.5 text-[11px] text-slate-500 font-medium flex-wrap">
                    <span className="inline-flex items-center gap-1 text-slate-300 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/5">
                      <TrendingUp className="w-3 h-3 text-[#ff5e1e]" />
                      <span>{listing.category}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 truncate max-w-[140px] sm:max-w-none">{listing.display_url}</span>
                    <span className="text-slate-600">•</span>
                    <span className="inline-flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3 text-slate-400" />
                      <span>{listing.click_count.toLocaleString()} clicks</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{timeAgo(listing.last_bid_at)}</span>
                  </div>
                </div>
              </div>

              {/* Right group: Staked amount & Outbid button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Staked Bid</div>
                  <div className="font-extrabold text-white text-lg leading-tight font-mono">
                    {formatCurrency(listing.total_bid_cents)}
                  </div>
                </div>

                <a
                  href={`/?url=${encodeURIComponent(listing.url)}`}
                  className="accent-glow-btn text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Outbid</span>
                </a>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

