'use client'

import { useState } from 'react'
import { Globe, ArrowUpRight, Zap } from 'lucide-react'
import { CATEGORIES } from '@/types/database'
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
      <div className="glass-nav rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl shadow-black/70 flex flex-col sm:flex-row gap-2 items-stretch border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* URL Input */}
        <div className="flex items-center gap-3 flex-1 px-4 py-1.5">
          <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your product URL or @handle..."
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-500 text-white min-w-0 font-medium"
            onKeyDown={(e) => e.key === 'Enter' && handleOutbidClick()}
          />
        </div>

        {/* Category selector */}
        <div className="hidden md:flex items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs font-semibold text-slate-300 bg-[#161926] border border-white/10 rounded-full px-4 py-2.5 outline-none cursor-pointer hover:border-white/20 focus:border-[#ff5e1e] transition-colors"
          >
            <option value="" className="bg-[#161926]">Category (Optional)</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#161926]">{cat}</option>
            ))}
          </select>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleOutbidClick}
          disabled={!url.trim()}
          className="accent-glow-btn disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-lg"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Outbid</span>
        </button>
      </div>

      {/* Submit modal */}
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

