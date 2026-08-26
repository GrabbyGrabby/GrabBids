import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#fdf8f5] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-3">You&apos;re on the board! 🎉</h1>
        <p className="text-gray-600 mb-2 text-base">
          Your payment was confirmed. Your listing has been ranked on the leaderboard based on
          your cumulative bid.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Rank updates can take a few seconds to propagate.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#e85d26] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#d44f1a] transition-colors"
        >
          View the Leaderboard →
        </Link>

        <p className="mt-6 text-xs text-gray-400">
          Want to outbid someone? Just submit their URL again with a higher amount.
        </p>
      </div>
    </main>
  )
}
