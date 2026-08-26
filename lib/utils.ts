import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()

  // Handle @handles (Twitter/X)
  if (trimmed.startsWith('@')) {
    return trimmed.toLowerCase()
  }

  try {
    let urlStr = trimmed
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      urlStr = 'https://' + urlStr
    }
    const parsed = new URL(urlStr)
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
    const path = parsed.pathname.replace(/\/$/, '')
    return host + path
  } catch {
    return trimmed.toLowerCase()
  }
}

export function getDisplayUrl(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('@')) return trimmed
  try {
    let urlStr = trimmed
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      urlStr = 'https://' + urlStr
    }
    const parsed = new URL(urlStr)
    return parsed.hostname.replace(/^www\./, '') + (parsed.pathname !== '/' ? parsed.pathname : '')
  } catch {
    return trimmed
  }
}

export function getFullUrl(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('@')) {
    return `https://x.com/${trimmed.slice(1)}`
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return 'https://' + trimmed
  }
  return trimmed
}

export function getFaviconUrl(displayUrl: string): string {
  const domain = displayUrl.split('/')[0]
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  if (diffMins > 0) return `${diffMins}m ago`
  return 'just now'
}
