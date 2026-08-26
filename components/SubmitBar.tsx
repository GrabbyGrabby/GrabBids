'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { CATEGORIES } from '@/types/database'
import { submitOrBoostListing } from '@/lib/actions'
import SubmitDialog from './SubmitDialog'

export default function SubmitBar() {
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleOutbidClick() {
    if (!url.trim()) return
    setDialogOpen(true)
  }

  return (
    <>
      <div className="flex gap-2 items-stretch bg-white border border-gray-200 rounded-2xl shadow-sm p-2">
        {/* URL input */}
        <div className="flex items-center gap-2 flex-1 px-3">
          <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Your product URL or @handle"
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400 text-gray-900 min-w-0"
            onKeyDown={(e) => e.key === 'Enter' && handleOutbidClick()}
          />
        </div>

        {/* Category selector */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer hidden sm:block"
        >
          <option value="">Choose a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* CTA button */}
        <button
          onClick={handleOutbidClick}
          disabled={!url.trim()}
          className="bg-[#e85d26] hover:bg-[#d44f1a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          Outbid
        </button>
      </div>

      {/* Submit dialog */}
      {dialogOpen && (
        <SubmitDialog
          initialUrl={url}
          initialCategory={category}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  )
}
