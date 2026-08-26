# GrabBids 🏆

A viral **pay-to-rank** public leaderboard. Outbid everyone to claim the #1 spot.

Built with **Next.js 16** (App Router) · **Supabase** · **Stripe** · **Tailwind CSS v4** · **Framer Motion**

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account (test mode is fine)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

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
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | See step 4 below |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |

### 3. Database Setup

In your Supabase project, go to **SQL Editor** and run the contents of `supabase/schema.sql`.

### 4. Stripe Webhook (Local Dev)

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` key printed by the CLI into `STRIPE_WEBHOOK_SECRET`.

### 5. Run the App

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
Server Action creates Stripe Checkout Session
(pending_submissions row parked in DB)
        ↓
User completes payment in Stripe
        ↓
Stripe POSTs to /api/webhooks/stripe
  • Verifies HMAC-SHA256 signature
  • Looks up pending_submissions by session ID
  • Creates or boosts listing
  • Appends immutable transaction record
  • Revalidates homepage cache
        ↓
Leaderboard updates in real-time
```

**Security guarantee**: `total_bid_cents` is **never written by client code**. Only the webhook handler (which verifies the Stripe HMAC signature) can update it.

---

## Production Deployment (Vercel)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add all env vars in Vercel project settings
4. Add a Stripe webhook endpoint in the Stripe Dashboard pointing to `https://yourdomain.com/api/webhooks/stripe`
5. Enable events: `checkout.session.completed`

---

## Architecture

```
app/
├── page.tsx                    # Leaderboard (Server Component, revalidates on webhook)
├── layout.tsx                  # Root layout
├── success/page.tsx            # Post-payment success
├── go/[id]/route.ts            # Click tracking redirect
└── api/webhooks/stripe/route.ts  # Stripe webhook (ONLY place that writes DB)

components/
├── LeaderboardTable.tsx        # Animated rank table (Framer Motion)
├── SubmitBar.tsx               # Top URL input bar
├── SubmitDialog.tsx            # Full submission/boost modal
└── CategorySidebar.tsx         # Left category nav

lib/
├── actions.ts                  # Server Actions (read leaderboard, create Stripe session)
├── stripe.ts                   # Stripe singleton
├── supabase/
│   ├── client.ts               # Browser client (anon key)
│   └── server.ts               # Server + service-role clients
└── utils.ts                    # URL normalization, formatting

supabase/
└── schema.sql                  # Run once in Supabase SQL Editor
```

---

## Key Rules

| Rule | Implementation |
|---|---|
| Rank = cumulative bid, tie-broken by earliest submission | `ORDER BY total_bid_cents DESC, first_bid_at ASC` |
| No duplicate listings | `UNIQUE` constraint on `listings.url` (normalized) |
| No client-side rank manipulation | RLS blocks all anon writes; webhook uses service role |
| Idempotent webhook | `UNIQUE` constraint on `transactions.stripe_session_id` |
| Click tracking | `/go/[id]` server route increments counter, then 302 redirects |
