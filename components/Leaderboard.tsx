"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ExternalLink, Sparkles, Heart, Crown } from "lucide-react";
import gsap from "gsap";

interface Listing {
  id: string | number;
  product_name: string;
  product_url: string;
  tagline: string;
  upvotes: number;
  clicks?: number;
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

  // GSAP animation for initial load
  useEffect(() => {
    if (!loading && listings.length > 0) {
      gsap.fromTo(
        ".leaderboard-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.2)", clearProps: "all" }
      );
    }
  }, [loading]);

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

  const handleCardClick = async (listing: Listing) => {
    window.open(listing.product_url, "_blank");
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listing.id }),
      });
      // Optimistically update clicks
      setListings(prev => 
        prev.map(l => l.id === listing.id ? { ...l, clicks: (l.clicks || 0) + 1 } : l)
      );
    } catch (err) {}
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
              const rankLabel = `#${rank}`;
              const hasVoted = upvotedIds.has(String(listing.id));
              const clicks = listing.clicks ?? 0;

              let cardStyle = "bg-[#F0E7D5] border-transparent text-[#17191D] hover:shadow-md z-0";
              let rankStyle = "bg-[#E8DCC8] text-[#1F2A44]";
              let subtitleStyle = "text-[#1F2A44]/70";
              let timeStyle = "text-[#1F2A44]/60";
              let upvoteActiveStyle = hasVoted
                ? "bg-[#1F2A44] text-[#E8DCC8] font-bold border-transparent"
                : "bg-white/60 text-[#1F2A44] hover:bg-[#1F2A44] hover:text-[#E8DCC8] border-transparent";

              if (index === 0) {
                cardStyle = "bg-[#1F2A44] border-transparent text-[#E8DCC8] shadow-[0_12px_36px_rgba(31,42,68,0.18)] hover:-translate-y-1 scale-[1.02] md:scale-[1.04] z-10 my-4 md:my-6";
                rankStyle = "bg-[#C6A75E] text-[#1F2A44] shadow-lg";
                subtitleStyle = "text-[#E8DCC8]/70";
                timeStyle = "text-[#E8DCC8]/60";
                upvoteActiveStyle = hasVoted
                  ? "bg-[#C6A75E] text-[#1F2A44] font-bold shadow-md border-transparent"
                  : "bg-white/10 text-[#E8DCC8] hover:bg-[#C6A75E] hover:text-[#1F2A44] border-transparent";
              } else if (index === 1) {
                cardStyle = "bg-[#D4BCC8] border-transparent text-[#17191D] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 scale-[1.01] z-0";
                rankStyle = "bg-[#17191D] text-[#D4BCC8] shadow-md";
                subtitleStyle = "text-[#17191D]/70";
                timeStyle = "text-[#17191D]/60";
                upvoteActiveStyle = hasVoted
                  ? "bg-[#17191D] text-[#D4BCC8] font-bold border-transparent"
                  : "bg-white/50 text-[#17191D] hover:bg-[#17191D] hover:text-[#D4BCC8] border-transparent";
              } else if (index === 2) {
                cardStyle = "bg-[#8EB69B] border-transparent text-[#051F20] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 z-0";
                rankStyle = "bg-[#051F20] text-[#8EB69B] shadow-sm";
                subtitleStyle = "text-[#051F20]/70";
                timeStyle = "text-[#051F20]/60";
                upvoteActiveStyle = hasVoted
                  ? "bg-[#051F20] text-[#8EB69B] font-bold border-transparent"
                  : "bg-white/50 text-[#051F20] hover:bg-[#051F20] hover:text-[#8EB69B] border-transparent";
              }

              return (
                <motion.div
                  key={listing.id}
                  layout
                  onClick={() => handleCardClick(listing)}
                  className={`leaderboard-card group relative flex items-center justify-between gap-4 p-5 md:p-6 rounded-[28px] border transition-all duration-200 cursor-pointer ${cardStyle}`}
                >
                  {/* Left: Rank + Info */}
                  <div className="flex items-center gap-4 md:gap-6 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm md:text-base flex-shrink-0 ${rankStyle}`}>
                      <span>{rankLabel}</span>
                    </div>

                    {/* Title + Tagline */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold truncate leading-tight flex items-center gap-1.5">
                          {listing.product_name}
                          <ExternalLink size={13} className="opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </span>
                      </div>
                      <p className={`text-[13px] font-medium truncate ${subtitleStyle}`}>
                        {listing.tagline} <span className="opacity-40 mx-1.5">•</span> {clicks.toLocaleString()} clicks
                      </p>
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
                    </button>

                    <span className={`text-[10px] tabular-nums font-semibold pr-1 ${timeStyle}`}>
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
