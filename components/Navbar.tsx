"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar({ onClaimClick }: { onClaimClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-5"
    >
      <div className="max-w-[1180px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-2xl bg-[#1f2a44] text-[#fbf8f3] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles size={16} className="text-[#c6a75e]" />
          </span>
          <span className="text-xl font-bold tracking-tight text-[#17191d]">
            grab<span className="text-[#1b5e48]">bids</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-black/6 bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <a
            href="#leaderboard"
            className="px-5 py-2 rounded-full text-xs font-semibold text-[#6b7280] hover:text-[#17191d] hover:bg-[#f5f0e6] transition-all duration-200"
          >
            Leaderboard
          </a>
          <a
            href="#how-it-works"
            className="px-5 py-2 rounded-full text-xs font-semibold text-[#6b7280] hover:text-[#17191d] hover:bg-[#f5f0e6] transition-all duration-200"
          >
            How it works
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClaimClick}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1f2a44] text-[#fbf8f3] text-xs font-semibold hover:bg-[#151c30] hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            Submit link
            <ArrowUpRight size={14} />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-white border border-black/6 text-[#17191d] hover:bg-[#f5f0e6] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mt-3 mx-auto max-w-[1180px] rounded-3xl border border-black/8 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              <a
                href="#leaderboard"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-semibold text-[#6b7280] hover:text-[#17191d] hover:bg-[#f5f0e6] transition-colors"
              >
                Leaderboard
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-semibold text-[#6b7280] hover:text-[#17191d] hover:bg-[#f5f0e6] transition-colors"
              >
                How it works
              </a>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onClaimClick?.();
                }}
                className="mt-1 px-4 py-3 rounded-2xl bg-[#1f2a44] text-[#fbf8f3] text-sm font-semibold text-center cursor-pointer"
              >
                Submit link ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
