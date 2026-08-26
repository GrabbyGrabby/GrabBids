-- ============================================================
-- GrabBids — Supabase / PostgreSQL Schema
-- Run this in your Supabase project SQL Editor
-- ============================================================

-- LISTINGS: one row per unique URL/handle on the leaderboard
CREATE TABLE IF NOT EXISTS listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url             TEXT NOT NULL UNIQUE,
  display_url     TEXT NOT NULL,
  title           TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL DEFAULT '',
  category        TEXT NOT NULL DEFAULT 'General',
  favicon_url     TEXT,
  total_bid_cents BIGINT NOT NULL DEFAULT 0,
  click_count     BIGINT NOT NULL DEFAULT 0,
  first_bid_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_bid_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_rank
  ON listings (total_bid_cents DESC, first_bid_at ASC);

CREATE INDEX IF NOT EXISTS idx_listings_category
  ON listings (category, total_bid_cents DESC, first_bid_at ASC);

-- TRANSACTIONS: immutable log, written ONLY by Stripe webhook
CREATE TABLE IF NOT EXISTS transactions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id            UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  stripe_session_id     TEXT NOT NULL UNIQUE,
  stripe_payment_intent TEXT,
  amount_cents          BIGINT NOT NULL,
  submitter_email       TEXT,
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at               TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_transactions_listing
  ON transactions (listing_id, paid_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_session
  ON transactions (stripe_session_id);

-- PENDING_SUBMISSIONS: parked intent while user is in Stripe Checkout
CREATE TABLE IF NOT EXISTS pending_submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  listing_id        UUID REFERENCES listings(id),
  url               TEXT,
  display_url       TEXT,
  title             TEXT,
  description       TEXT,
  category          TEXT,
  submitter_email   TEXT,
  amount_cents      BIGINT NOT NULL,
  is_new_listing    BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours')
);

CREATE INDEX IF NOT EXISTS idx_pending_session
  ON pending_submissions (stripe_session_id);

-- ROW LEVEL SECURITY
ALTER TABLE listings             ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_submissions   ENABLE ROW LEVEL SECURITY;

-- Public read only
CREATE POLICY "listings_public_read"  ON listings FOR SELECT USING (true);
CREATE POLICY "transactions_public_read" ON transactions FOR SELECT USING (true);

-- Service role bypasses RLS automatically for all writes
