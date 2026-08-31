import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — GrabBids',
  description: 'Terms and conditions governing the use of the GrabBids platform and promotional bidding services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-orange-100 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#e85d26] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 26, 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing, submitting a listing, or placing a bid on GrabBids (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;),
              you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use or access our service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. Service Description & Bidding Model</h2>
            <p>
              GrabBids is a competitive, pay-to-rank promotional leaderboard and directory for digital products, startups, and websites.
              Rankings on the platform are determined cumulatively based on total verified bids placed for a given URL.
            </p>
            <p className="mt-2">
              Bids represent one-time promotional fees that elevate or maintain your project&apos;s rank on the leaderboard.
              Outbidding by other users may change your relative position over time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. Payment & Non-Refundable Policy</h2>
            <p>
              All payments on GrabBids are processed securely via our payment provider Dodo Payments.
              By submitting a bid, you authorize the charge to your chosen payment method.
            </p>
            <p className="mt-2">
              <strong>Non-Refundable Policy:</strong> Because promotional leaderboard visibility, SEO backlinks, and click allocation are granted
              immediately upon successful transaction processing, <strong>all bids and payments are strictly non-refundable</strong>,
              except where required by applicable consumer law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">4. User Submissions & Warranties</h2>
            <p>When submitting a link, title, description, or logo, you represent and warrant that:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>You own or hold valid rights/permissions to promote the linked website or project.</li>
              <li>The URL points to an active, safe, and functional destination.</li>
              <li>The content does not infringe upon any third-party intellectual property or privacy rights.</li>
              <li>The destination complies strictly with our <Link href="/guidelines" className="text-[#e85d26] underline">Community Guidelines & Prohibited Content Policy</Link>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">5. Moderation, Takedown & Forfeiture</h2>
            <p>
              We reserve the absolute right to review, reject, or remove any listing at our sole discretion if it violates our acceptable use policies,
              contains misleading information, links to malicious or illegal content, or disrupts platform integrity.
            </p>
            <p className="mt-2 text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <strong>Notice of Forfeiture:</strong> If a listing is removed due to a violation of our Prohibited Content Policy or fraudulent activity,
              all associated bid fees are permanently forfeited and will not be refunded.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">6. Limitation of Liability & Disclaimer</h2>
            <p>
              GrabBids is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied.
              We do not guarantee specific click volumes, conversion rates, traffic thresholds, or permanent leaderboard positions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">7. Contact Information</h2>
            <p>
              For inquiries regarding these Terms or billing questions, please contact our support team at{' '}
              <a href="mailto:thedeadcurse@gmail.com" className="text-[#e85d26] font-medium underline">
                thedeadcurse@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
