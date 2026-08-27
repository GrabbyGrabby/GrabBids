import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — GrabBids',
  description: 'Privacy policy for GrabBids detailing how data is collected, used, and protected.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-orange-100 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#e85d26] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 26, 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              When you use GrabBids, we collect minimal information necessary to deliver our promotional leaderboard service:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Submission Details:</strong> Destination URL, project title, category, description, and logo/favicon URL.</li>
              <li><strong>Payment Information:</strong> Transaction identifiers and payment status provided securely via our payment gateways (Dodo Payments / Stripe). We do not store raw credit card numbers.</li>
              <li><strong>Usage & Analytics:</strong> Aggregate click counts and outbound referral events.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. How We Use Information</h2>
            <p>
              We use collected information solely to maintain the leaderboard, process promotional placements, prevent fraudulent transactions or malicious submissions, and provide customer support.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. Third-Party Service Providers</h2>
            <p>
              We partner with trusted service providers to process payments and host infrastructure (such as Supabase, Dodo Payments, and Stripe). These providers handle data strictly in accordance with their respective security and privacy standards.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">4. Data Retention & Deletion</h2>
            <p>
              Public listing data remains visible as long as the listing is active on the leaderboard. You may request deletion or modification of your listing by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please email us at{' '}
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
