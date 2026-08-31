'use client'

import { useState, useEffect, useTransition } from 'react'
import { X, Loader2, AlertCircle } from 'lucide-react'
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

const MIN_BID_CENTS = 100 // $1.00

export default function SubmitDialog({ initialUrl = '', initialCategory = '', onClose }: SubmitDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [url, setUrl] = useState(initialUrl)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [email, setEmail] = useState('')
  const [amountDollars, setAmountDollars] = useState('1')

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
    }, 600)
    return () => clearTimeout(timer)
  }, [url])

  const amountCents = Math.round(parseFloat(amountDollars || '0') * 100)
  const isBoost = !!existingListing
  const newTotal = isBoost ? existingListing!.total_bid_cents + amountCents : amountCents

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (amountCents < MIN_BID_CENTS) {
      setError('Minimum bid is $1.00')
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

      // Redirect to Stripe Checkout
      window.location.href = result.checkoutUrl
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isBoost ? '🚀 Boost your ranking' : '✨ Submit to the board'}
            </h2>
            {isBoost && (
              <p className="text-sm text-gray-500 mt-0.5">
                This URL is already on the board at{' '}
                <strong>{formatCurrency(existingListing!.total_bid_cents)}</strong>. Your bid
                will add to the total.
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              URL or @handle <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourproduct.com or @handle"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e85d26]/30 focus:border-[#e85d26] transition-all"
              />
              {lookingUp && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {isBoost && (
              <p className="mt-1.5 text-xs text-amber-600 font-medium">
                ⚡ Already on board — this will boost the existing entry
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your product or brand name"
              required
              maxLength={80}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e85d26]/30 focus:border-[#e85d26] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One-liner about your product or page"
              required
              maxLength={200}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e85d26]/30 focus:border-[#e85d26] transition-all resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e85d26]/30 focus:border-[#e85d26] transition-all bg-white cursor-pointer"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Bid amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your bid <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">$</span>
              <input
                type="number"
                value={amountDollars}
                onChange={(e) => setAmountDollars(e.target.value)}
                min="1"
                step="1"
                required
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e85d26]/30 focus:border-[#e85d26] transition-all"
              />
            </div>
            {isBoost && amountCents >= MIN_BID_CENTS && (
              <p className="mt-1.5 text-xs text-gray-500">
                New total:{' '}
                <strong className="text-[#e85d26]">{formatCurrency(newTotal)}</strong>
                {' '}(current: {formatCurrency(existingListing!.total_bid_cents)} + your bid:{' '}
                {formatCurrency(amountCents)})
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com — for receipt only"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e85d26]/30 focus:border-[#e85d26] transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || amountCents < MIN_BID_CENTS}
            className="w-full bg-[#e85d26] hover:bg-[#d44f1a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to payment…
              </>
            ) : (
              `Pay ${formatCurrency(amountCents)} → Claim your rank`
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Payments processed securely by Dodo Payments. No account required.
          </p>
        </form>
      </div>
    </div>
  )
}
