'use client'

import { useState, useEffect, useTransition } from 'react'
import { X, Loader2, AlertCircle, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '@/types/database'
import { submitOrBoostListing } from '@/lib/actions'
import { formatCurrency, normalizeUrl } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Listing } from '@/types/database'

interface SubmitDialogProps {
  initialUrl?: string
  initialCategory?: string
  onClose: () => void
}

const MIN_BID_CENTS = 10000 // ₹100.00

export default function SubmitDialog({ initialUrl = '', initialCategory = '', onClose }: SubmitDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [url, setUrl] = useState(initialUrl)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [email, setEmail] = useState('')
  const [amountRupees, setAmountRupees] = useState('100')

  // Existing listing lookup
  const [existingListing, setExistingListing] = useState<Listing | null>(null)
  const [lookingUp, setLookingUp] = useState(false)

  // Debounced lookup
  useEffect(() => {
    if (!url.trim()) {
      setExistingListing(null)
      return
    }
    const timer = setTimeout(async () => {
      setLookingUp(true)
      const normalized = normalizeUrl(url)
      const supabase = createClient()
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('url', normalized)
        .maybeSingle()
      setExistingListing(data as Listing | null)
      if (data) {
        // Pre-fill from existing
        setTitle((t) => t || data.title)
        setDescription((d) => d || data.description)
        setCategory((c) => c || data.category)
      }
      setLookingUp(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [url])

  const amountCents = Math.round(parseFloat(amountRupees || '0') * 100)
  const isBoost = !!existingListing
  const newTotal = isBoost ? existingListing!.total_bid_cents + amountCents : amountCents

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (amountCents < MIN_BID_CENTS) {
      setError(`Minimum bid is ${formatCurrency(MIN_BID_CENTS)}`)
      return
    }

    startTransition(async () => {
      const result = await submitOrBoostListing({
        rawUrl: url,
        title,
        description,
        category,
        amountCents,
        submitterEmail: email || undefined,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      window.location.href = result.checkoutUrl
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#11131c] border border-white/10 rounded-[30px] shadow-2xl shadow-black/90 text-slate-100"
        >
          {/* Top highlight bar */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#ff5e1e] to-transparent w-full" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#ff5e1e]/10 border border-[#ff5e1e]/20 flex items-center justify-center text-[#ff5e1e]">
                {isBoost ? <Zap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  {isBoost ? 'Boost Your Spot' : 'Claim a Spot on the Board'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isBoost
                    ? 'Your new bid stacks on top of the current stake.'
                    : 'Outbid other listings to rise to the top.'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Target URL or Handle <span className="text-[#ff5e1e]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourstartup.com or @handle"
                  required
                  className="w-full bg-[#181b2a] border border-white/10 rounded-[14px] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#ff5e1e] focus:ring-2 focus:ring-[#ff5e1e]/20 transition-all"
                />
                {lookingUp && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#ff5e1e]" />
                  </div>
                )}
              </div>
              {isBoost && (
                <div className="mt-2 p-3 rounded-[14px] bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Existing listing found at <strong>{formatCurrency(existingListing!.total_bid_cents)}</strong>. Boosting will add to this.</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Title / Name <span className="text-[#ff5e1e]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product name or headline"
                required
                maxLength={80}
                className="w-full bg-[#181b2a] border border-white/10 rounded-[14px] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#ff5e1e] focus:ring-2 focus:ring-[#ff5e1e]/20 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Short Description <span className="text-[#ff5e1e]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What makes your link awesome? (1-2 sentences)"
                required
                maxLength={200}
                rows={2}
                className="w-full bg-[#181b2a] border border-white/10 rounded-[14px] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#ff5e1e] focus:ring-2 focus:ring-[#ff5e1e]/20 transition-all resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Category <span className="text-[#ff5e1e]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-[#181b2a] border border-white/10 rounded-[14px] px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff5e1e] focus:ring-2 focus:ring-[#ff5e1e]/20 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#181b2a]">Choose category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#181b2a]">{cat}</option>
                ))}
              </select>
            </div>

            {/* Bid Amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Bid Amount (INR) <span className="text-[#ff5e1e]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(e.target.value)}
                  min="100"
                  step="1"
                  required
                  className="w-full bg-[#181b2a] border border-white/10 rounded-[14px] pl-8 pr-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-[#ff5e1e] focus:ring-2 focus:ring-[#ff5e1e]/20 transition-all"
                />
              </div>
              {isBoost && amountCents >= MIN_BID_CENTS && (
                <div className="mt-2 text-xs text-slate-400 flex items-center justify-between px-1">
                  <span>New Total Cumulative Stake:</span>
                  <span className="text-white font-bold font-mono">{formatCurrency(newTotal)}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Receipt Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#181b2a] border border-white/10 rounded-[14px] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#ff5e1e] focus:ring-2 focus:ring-[#ff5e1e]/20 transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-[14px] px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || amountCents < MIN_BID_CENTS}
              className="w-full accent-glow-btn text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Initiating Checkout...</span>
                </>
              ) : (
                <>
                  <span>Pay {formatCurrency(amountCents)} & Claim Rank</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant automated activation via Dodo Payments</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

