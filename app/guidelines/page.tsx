import Link from 'next/link'
import { ArrowLeft, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Community Guidelines & Safety — GrabBids',
  description: 'Platform rules, prohibited activities, moderation policies, and safety measures on GrabBids.',
}

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-orange-100 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#e85d26] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
          Community Guidelines & Safety Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 26, 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <p>
              GrabBids is committed to maintaining a safe, transparent, and high-quality directory for discoverable web projects.
              To protect our users, visitors, and payment infrastructure, all submitted URLs and promotional bids must strictly adhere to the following rules.
            </p>
          </section>

          {/* Prohibited Activities */}
          <section className="bg-red-50/70 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-red-700 font-bold text-base mb-3">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h2>Prohibited Content & Activities</h2>
            </div>
            <p className="text-xs text-red-900 mb-3">
              Submissions containing or linking to any of the following categories will be rejected or immediately removed without refund:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-red-950">
              <li><strong>Malware, Phishing & Deception:</strong> Sites hosting viruses, spyware, deceptive download links, credential harvesting, or deceptive redirects.</li>
              <li><strong>Adult & Sexually Explicit Material:</strong> Pornography, escort services, sexually explicit media, or non-consensual imagery.</li>
              <li><strong>Illegal Goods & Services:</strong> Illicit drugs, prescription drugs without verification, weapons, counterfeit goods, or hacked accounts/software.</li>
              <li><strong>Financial Scams & Fraud:</strong> Ponzi schemes, multi-level marketing (MLM), unlicensed high-yield investment programs (HYIP), or fraudulent cryptocurrency offerings.</li>
              <li><strong>Hate Speech & Harassment:</strong> Content that promotes violence, discrimination, harassment, defamation, or targeting of protected groups.</li>
              <li><strong>Intellectual Property Infringement:</strong> Unlicensed distribution of copyrighted materials, torrent indexes, or unauthorized trademark usage.</li>
              <li><strong>Unregulated Gambling:</strong> Unlicensed online casinos, sports betting schemes, or sweepstakes violating local regulations.</li>
            </ul>
          </section>

          {/* Moderation and Enforcement */}
          <section>
            <div className="flex items-center gap-2 text-gray-900 font-bold text-base mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2>Moderation & Safety Measures</h2>
            </div>
            <div className="space-y-3">
              <p>
                To uphold platform security and user trust, GrabBids enforces a multi-layered moderation pipeline:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">1. Automated Domain Verification</span>
                  Submitted URLs are automatically checked for active HTTPS protocols, reachable servers, and domain reputation against known threat blacklists.
                </div>
                <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">2. Human Review & Audit</span>
                  Our moderation team conducts regular audits of live listings, ranking surges, and destination redirects to verify ongoing compliance.
                </div>
                <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">3. Safe Redirect Tracking</span>
                  Outgoing clicks pass through our redirect gateway (<code>/go/[id]</code>) which allows immediate blacklisting and disablement of malicious links.
                </div>
                <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">4. Zero-Tolerance Takedown</span>
                  Any listing confirmed to breach our guidelines is purged immediately, with the domain permanently blocked from future submissions.
                </div>
              </div>
            </div>
          </section>

          {/* Abuse & Reporting */}
          <section className="bg-amber-50/70 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h2>Reporting Violations & Community Safety</h2>
            </div>
            <p className="text-xs text-amber-950 mb-3">
              If you encounter a listing on GrabBids that links to malicious content, copyright violations, or prohibited material, please report it immediately:
            </p>
            <div className="text-xs text-amber-950 font-mono bg-white/80 p-3 rounded-lg border border-amber-200">
              Email: <a href="mailto:thedeadcurse@gmail.com" className="text-[#e85d26] underline font-bold">thedeadcurse@gmail.com</a><br />
              Please include the listing URL, listing title, and detailed reason for the report. All abuse reports are processed within 24 hours.
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
