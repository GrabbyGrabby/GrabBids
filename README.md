# GrabBids 🏆

A viral **pay-to-rank** public leaderboard. Outbid everyone to claim the #1 spot.

Built with **Next.js 16** (App Router) · **Supabase** · **Dodo Payments** · **Tailwind CSS v4** · **Framer Motion**

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Dodo Payments](https://dodopayments.com) account

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API (secret!) |
| `DODO_PAYMENTS_API_KEY` | Dodo Dashboard → Developer → API Keys |
| `DODO_PAYMENTS_ENVIRONMENT` | `live_mode` or `test_mode` |
| `DODO_PAYMENTS_PRODUCT_ID` | Dodo Dashboard → Products |
| `DODO_PAYMENTS_WEBHOOK_KEY` | Dodo Dashboard → Developer → Webhooks |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` or `https://grab-bids.vercel.app` |

### 3. Database Setup

In your Supabase project, go to **SQL Editor** and run the contents of `supabase/schema.sql`.

### 4. Run the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How It Works

```
User submits URL + bid amount
        ↓
Server Action creates Dodo Payments Checkout Session
        ↓
User completes payment in Dodo Payments
        ↓
Dodo Payments POSTs to /api/webhooks/dodo
  • Verifies webhook signature
  • Reads metadata (URL, bid amount, title, category)
  • Creates or boosts listing in Supabase
  • Appends immutable transaction record
  • Revalidates homepage cache
        ↓
Leaderboard updates in real-time
```

**Security guarantee**: `total_bid_cents` is **never written by client code**. Only the webhook handler (which verifies the Dodo signature) can update it.

---

## Production Deployment (Vercel)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add env vars in Vercel project settings
4. Add a Dodo webhook endpoint in the Dodo Dashboard pointing to `https://yourdomain.com/api/webhooks/dodo`
5. Enable event: `payment.succeeded`
