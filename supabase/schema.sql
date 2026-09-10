-- ============================================================
-- GrabBids — Supabase / PostgreSQL Schema (Upvote-Based Rankings)
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
  upvotes         BIGINT NOT NULL DEFAULT 1,
  click_count     BIGINT NOT NULL DEFAULT 0,
  first_bid_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_bid_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure upvotes column exists if table was created previously
ALTER TABLE listings ADD COLUMN IF NOT EXISTS upvotes BIGINT NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_listings_upvotes
  ON listings (upvotes DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_category
  ON listings (category, upvotes DESC, created_at DESC);

-- RPC for atomic upvoting
CREATE OR REPLACE FUNCTION increment_upvote(listing_id UUID)
RETURNS BIGINT AS $$
  UPDATE listings
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = listing_id
  RETURNING upvotes;
$$ LANGUAGE sql SECURITY DEFINER;

-- ROW LEVEL SECURITY
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "listings_public_read" ON listings FOR SELECT USING (true);

-- Public insert access (for free submissions)
CREATE POLICY "listings_public_insert" ON listings FOR INSERT WITH CHECK (true);

-- Public update for upvotes
CREATE POLICY "listings_public_update" ON listings FOR UPDATE USING (true);
