"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function CTASection({
  onClaimClick,
}: {
  onClaimClick?: () => void;
}) {
  return (
    <section className="px-4 py-20 max-w-[1180px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative text-center p-12 md:p-16 rounded-[36px] bg-[#1f2a44] text-[#fbf8f3] shadow-[0_12px_40px_rgba(31,42,68,0.12)] border border-[#1f2a44]"
      >
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold text-[#c6a75e] tracking-wider uppercase mb-5">
            <Sparkles size={13} />
            OPEN DIRECTORY
          </div>

          <h2 className="text-[clamp(28px,4.5vw,44px)] font-extrabold tracking-tight leading-tight mb-4 text-[#fbf8f3]">
            Ready to get
            <br />
            <span className="text-[#cfe9de]">discovered?</span>
          </h2>
          <p className="text-sm text-white/80 font-medium leading-relaxed mb-8">
            Submit your link for free and invite your community to vote your project up to the top spot.
          </p>

          <button
            onClick={onClaimClick}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#cfe9de] text-[#1b5e48] font-extrabold text-sm hover:bg-white hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-md cursor-pointer"
          >
            Submit your link now
            <ArrowUpRight size={17} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
