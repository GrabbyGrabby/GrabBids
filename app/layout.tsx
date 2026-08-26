import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'GrabBids — Pay to Rank',
  description: 'The pay-to-rank public leaderboard. Outbid everyone to claim the #1 spot.',
  openGraph: {
    title: 'GrabBids — Pay to Rank',
    description: 'Outbid everyone to claim the #1 spot on the public leaderboard.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-[#fdf8f5] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
