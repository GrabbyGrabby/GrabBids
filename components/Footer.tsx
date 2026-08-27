import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-orange-100 bg-white/70 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <Link href="/" className="text-base font-bold tracking-tight text-gray-900">
              GrabBids
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">
              The pay-to-rank promotional leaderboard for web products and startups.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600 font-medium">
            <Link href="/terms" className="hover:text-[#e85d26] transition-colors">
              Terms of Service
            </Link>
            <Link href="/guidelines" className="hover:text-[#e85d26] transition-colors">
              Community Guidelines & Safety
            </Link>
            <Link href="/privacy" className="hover:text-[#e85d26] transition-colors">
              Privacy Policy
            </Link>
            <a
              href="mailto:thedeadcurse@gmail.com"
              className="hover:text-[#e85d26] transition-colors"
            >
              Support & Abuse Reporting
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} GrabBids. All rights reserved.</p>
          <p>All listings are moderated and subject to our Acceptable Use Policy.</p>
        </div>
      </div>
    </footer>
  )
}
