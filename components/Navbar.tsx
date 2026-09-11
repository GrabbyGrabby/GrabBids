"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar({ onClaimClick }: { onClaimClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-5"
    >
      <div className="max-w-[1180px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="text-xl font-bold tracking-tight text-[#17191d] group-hover:scale-[1.02] transition-transform">
            Grab<span className="text-[#1b5e48]">Bids</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-black/10 bg-white shadow-sm">
          <a
            href="/#leaderboard"
            className="px-5 py-2 rounded-full text-xs font-bold text-[#17191d] hover:bg-[#f5f0e6] transition-all duration-200"
          >
            Leaderboard
          </a>
          <a
            href="/how-it-works"
            className="px-5 py-2 rounded-full text-xs font-bold text-[#17191d] hover:bg-[#f5f0e6] transition-all duration-200 cursor-pointer"
          >
            How it works
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/submit"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1f2a44] !text-white text-xs font-bold hover:bg-[#151c30] hover:shadow-md transition-all duration-200 cursor-pointer tracking-wide"
          >
            Submit link
          </a>

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
                href="/#leaderboard"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-bold text-[#17191d] hover:bg-[#f5f0e6] transition-colors"
              >
                Leaderboard
              </a>
              <a
                href="/how-it-works"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-left rounded-2xl text-sm font-bold text-[#17191d] hover:bg-[#f5f0e6] transition-colors"
              >
                How it works
              </a>
              <a
                href="/submit"
                onClick={() => setMenuOpen(false)}
                className="mt-1 px-4 py-3 rounded-2xl bg-[#1f2a44] !text-white text-sm font-bold tracking-wide text-center cursor-pointer block"
              >
                Submit link
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
