"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ExternalLink, Sparkles, Heart, Crown } from "lucide-react";

interface Listing {
  id: string | number;
  product_name: string;
  product_url: string;
  tagline: string;
  upvotes: number;
  created_at: string;
  email?: string;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Leaderboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  // Load upvoted IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("grabbids_upvotes");
      if (stored) {
        setUpvotedIds(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, []);

  const fetchListings = useCallback(async () => {
    try {
      const res = await fetch("/api/listings");
      const data = await res.json();
      setListings(data.listings ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
    const interval = setInterval(fetchListings, 12000);
    return () => clearInterval(interval);
  }, [fetchListings]);

  const handleUpvote = async (listingId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const strId = String(listingId);

    // Optimistic UI update
    setListings((prev) =>
      prev
        .map((item) =>
          String(item.id) === strId
            ? { ...item, upvotes: (item.upvotes || 0) + (upvotedIds.has(strId) ? 0 : 1) }
            : item
        )
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    );

    if (!upvotedIds.has(strId)) {
      const updated = new Set(upvotedIds);
      updated.add(strId);
      setUpvotedIds(updated);
      try {
        localStorage.setItem("grabbids_upvotes", JSON.stringify(Array.from(updated)));
      } catch {}

      try {
        await fetch("/api/upvote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listing_id: listingId }),
        });
      } catch (err) {
        console.error("Upvote error:", err);
      }
    }
  };

  return (
    <section id="leaderboard" className="px-4 py-20 md:py-28 max-w-[960px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-black/6"
      >
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2px] text-[#6b7280] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b5e48] animate-pulse-dot" />
            LIVE COMMUNITY BOARD
          </span>
          <h2 className="text-[clamp(28px,4vw,38px)] font-extrabold tracking-tight text-[#17191d]">
            The <span className="text-[#1b5e48]">Leaderboard</span>
          </h2>
        </div>
        <span className="text-xs font-semibold text-[#6b7280] bg-white px-3.5 py-1.5 rounded-full border border-black/6 shadow-xs">
          {listings.length} {listings.length === 1 ? "entry" : "entries"} ranked
        </span>
      </motion.div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-3xl bg-white/70 border border-black/5 animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 px-6 rounded-[32px] border-2 border-dashed border-black/10 bg-white/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#f0e7d5] flex items-center justify-center text-[#1f2a44] mx-auto mb-4">
            <Sparkles size={22} />
          </div>
          <h3 className="text-base font-bold text-[#17191d] mb-1">No entries yet</h3>
          <p className="text-xs text-[#6b7280] max-w-xs mx-auto">
            Be the very first maker or creator to submit a project and hold the #1 spot!
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3.5">
          <AnimatePresence mode="popLayout">
            {listings.map((listing, index) => {
              const rank = index + 1;
              const hasVoted = upvotedIds.has(String(listing.id));

              // Distinct modern styling per top 3
              let cardStyle = "bg-white border-black/6 text-[#17191d] hover:border-black/15 shadow-[0_4px_20px_rgba(0,0,0,0.02)]";
              let badgeColor = "bg-black/5 text-[#6b7280]";
              let upvoteActiveStyle = hasVoted
                ? "bg-[#1f2a44] text-white border-transparent shadow-sm"
                : "bg-[#f5f0e6] text-[#17191d] hover:bg-[#1f2a44] hover:text-white border-black/5";

              if (rank === 1) {
                cardStyle = "bg-[#1f2a44] border-transparent text-[#fbf8f3] shadow-[0_12px_36px_rgba(31,42,68,0.18)]";
                badgeColor = "bg-[#c6a75e]/25 text-[#f0e7d5]";
                upvoteActiveStyle = hasVoted
                  ? "bg-[#c6a75e] text-[#1f2a44] font-bold shadow-md"
                  : "bg-white/10 text-[#fbf8f3] hover:bg-[#c6a75e] hover:text-[#1f2a44] border-white/15";
              } else if (rank === 2) {
                cardStyle = "bg-[#cfe9de] border-transparent text-[#1b5e48] shadow-[0_8px_24px_rgba(27,94,72,0.06)]";
                badgeColor = "bg-[#1b5e48]/15 text-[#1b5e48]";
                upvoteActiveStyle = hasVoted
                  ? "bg-[#1b5e48] text-white font-bold"
                  : "bg-white/70 text-[#1b5e48] hover:bg-[#1b5e48] hover:text-white border-black/5";
              } else if (rank === 3) {
                cardStyle = "bg-[#f0e7d5] border-transparent text-[#17191d] shadow-[0_6px_20px_rgba(0,0,0,0.03)]";
                badgeColor = "bg-black/8 text-[#17191d]";
                upvoteActiveStyle = hasVoted
                  ? "bg-[#1f2a44] text-white font-bold"
                  : "bg-white/80 text-[#17191d] hover:bg-[#1f2a44] hover:text-white border-black/5";
              }

              return (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
                  className={`group relative flex items-center justify-between gap-4 p-5 md:p-6 rounded-[28px] border transition-all duration-200 hover:-translate-y-0.5 ${cardStyle}`}
                >
                  {/* Left: Rank + Info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${badgeColor}`}>
                      {rank === 1 ? (
                        <Crown size={16} className="text-[#c6a75e]" />
                      ) : rank === 2 ? (
                        <Heart size={14} className="fill-current text-[#930507]" />
                      ) : (
                        <span>#{rank}</span>
                      )}
                    </div>

                    {/* Title + Tagline (Link text hidden) */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={listing.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-bold truncate leading-tight hover:underline flex items-center gap-1.5 group/link"
                        >
                          <span className="truncate">{listing.product_name}</span>
                          <ExternalLink size={13} className="opacity-40 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                        </a>
                      </div>

                      {listing.tagline && (
                        <p className={`text-xs truncate font-medium ${rank === 1 ? "text-white/70" : "text-[#6b7280]"}`}>
                          {listing.tagline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Upvote Button & Timestamp */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <button
                      onClick={(e) => handleUpvote(listing.id, e)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95 border ${upvoteActiveStyle}`}
                      title={hasVoted ? "You upvoted this!" : "Upvote"}
                    >
                      <ChevronUp
                        size={15}
                        className={`transition-transform ${hasVoted ? "stroke-[3]" : "group-hover:-translate-y-0.5"}`}
                      />
                      <span className="tabular-nums">{listing.upvotes ?? 1}</span>
                      {hasVoted && <Heart size={12} className="fill-current text-rose-500 ml-0.5" />}
                    </button>

                    <span className={`text-[10px] tabular-nums font-semibold pr-1 ${rank === 1 ? "text-white/50" : "text-[#9ca3af]"}`}>
                      {timeAgo(listing.created_at)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
