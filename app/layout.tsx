import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'GrabBids — Modern Community Ranked Leaderboard',
  description: 'Submit any link, SaaS, or project. Upvote the finest creations and climb to the #1 spot.',
  openGraph: {
    title: 'GrabBids — Modern Community Leaderboard',
    description: 'Submit any project or link and rise to the top with community upvotes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-[#fbf8f3] text-[#17191d] antialiased selection:bg-[#1f2a44]/15 selection:text-[#17191d] font-sans">
        {children}
      </body>
    </html>
  )
}
