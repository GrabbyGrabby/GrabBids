"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function HeroSection({
  onClaimClick,
}: {
  onClaimClick?: () => void;
}) {
  const [totalListings, setTotalListings] = useState<number>(0);

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((d) => {
        setTotalListings(d.listings?.length ?? 0);
      })
      .catch(() => {});
  }, []);

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  });

  return (
    <section className="relative min-h-[78vh] flex flex-col items-center justify-center px-4 pt-32 pb-16 bg-[#fbf8f3]">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.h1
          {...reveal(0.1)}
          className="text-[clamp(42px,6.5vw,78px)] font-extrabold leading-[1.02] tracking-[-2.5px] mb-6 text-[#17191d]"
        >
          Top Products.
          <br />
          <span className="text-[#1b5e48]">Chosen by you.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          {...reveal(0.2)}
          className="text-[#6b7280] text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10 font-medium"
        >
          Submit any link — your SaaS, X profile, tool, portfolio, or project.
          The community votes on the best creations to reach the #1 spot.
        </motion.p>

        {/* Action Button & Proof */}
        <motion.div {...reveal(0.3)} className="flex flex-col items-center gap-5 mt-10 md:mt-14">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/submit"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#1b5e48] !text-white font-bold tracking-tight text-[15px] hover:bg-[#124233] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-[0_8px_24px_rgba(27,94,72,0.12)] cursor-pointer"
            >
              Submit your link
            </a>
            <a
              href="/#leaderboard"
              className="px-8 py-4 rounded-full bg-[#1f2a44] border border-transparent !text-white font-bold tracking-tight text-[15px] hover:bg-[#151c30] transition-all duration-200 shadow-[0_8px_24px_rgba(31,42,68,0.12)]"
            >
              View rankings
            </a>
          </div>

          <p className="text-xs text-[#9ca3af] tracking-wide font-medium mt-3">
            {totalListings > 0 ? `${totalListings} projects listed` : "100% free submission"} • Real-time Supabase voting
          </p>
        </motion.div>
      </div>
    </section>
  );
}
