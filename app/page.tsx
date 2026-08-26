import { Suspense } from 'react'
import { getLeaderboard, getTopBidAmount, getLeaderboardStats } from '@/lib/actions'
import { CATEGORIES, CATEGORY_ICONS } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import LeaderboardTable from '@/components/LeaderboardTable'
import SubmitBar from '@/components/SubmitBar'
import CategorySidebar from '@/components/CategorySidebar'

export const revalidate = 0

interface PageProps {
  searchParams: Promise<{ category?: string; cancelled?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { category = 'All', cancelled } = await searchParams
  const [listings, topBidCents, stats] = await Promise.all([
    getLeaderboard(category === 'All' ? undefined : category),
    getTopBidAmount(),
    getLeaderboardStats(),
  ])

  return (
    <main className="min-h-screen bg-[#fdf8f5]">
      {/* ── Header / Hero ── */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">GrabBids</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            {stats.totalListings.toLocaleString()} listings ·{' '}
            {formatCurrency(stats.totalBidsCents)} total bids
          </div>
        </div>
      </header>

      {/* ── Hero CTA ── */}
      <section className="text-center py-10 px-4">
        <p className="text-sm text-gray-500 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5 align-middle" />
          New spots start at <strong>$1</strong>. Paying less than the #1 price still puts you on the board
          at whatever place that bid can take.
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-1">
          Claim <span className="text-gray-400">#1</span> for{' '}
          <span className="text-[#e85d26]">
            {topBidCents > 0 ? formatCurrency(topBidCents) : '$1'}
          </span>
          {topBidCents > 0 && <span className="text-gray-400 ml-1">+</span>}
        </h1>
      </section>

      {/* ── Submit Bar ── */}
      <div className="mx-auto max-w-6xl px-4 mb-8">
        <SubmitBar />
      </div>

      {/* ── Cancelled notice ── */}
      {cancelled && (
        <div className="mx-auto max-w-6xl px-4 mb-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3">
            Payment was cancelled. Your listing was not saved. You can try again anytime.
          </div>
        </div>
      )}

      {/* ── Main layout: sidebar + table ── */}
      <div className="mx-auto max-w-6xl px-4 pb-16 flex gap-6">
        {/* Category sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <CategorySidebar
            categories={['All', ...CATEGORIES]}
            icons={CATEGORY_ICONS}
            activeCategory={category}
            listings={listings}
          />
        </aside>

        {/* Leaderboard */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<LeaderboardSkeleton />}>
            <LeaderboardTable listings={listings} activeCategory={category} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  )
}
