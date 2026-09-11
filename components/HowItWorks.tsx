"use client";

import { motion } from "framer-motion";
import { Link2, ThumbsUp, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Link2,
    step: "01",
    label: "SUBMIT",
    title: "Submit any link",
    description: "Enter any X handle, website, SaaS product, newsletter, GitHub repo, or creator portfolio.",
    bg: "bg-[#cfe9de]",
    textColor: "text-[#1b5e48]",
    tagBg: "bg-[#1b5e48]/10 text-[#1b5e48]",
  },
  {
    icon: ThumbsUp,
    step: "02",
    label: "VOTE",
    title: "Collect upvotes",
    description: "Share with your network, audience, and community to gather upvotes in real-time.",
    bg: "bg-[#f0e7d5]",
    textColor: "text-[#17191d]",
    tagBg: "bg-black/5 text-[#17191d]",
  },
  {
    icon: Sparkles,
    step: "03",
    label: "RANK",
    title: "Claim the #1 spot",
    description: "Top voted links secure the permanent crown and maximum spotlight on the leaderboard.",
    bg: "bg-[#1f2a44]",
    textColor: "text-[#fbf8f3]",
    tagBg: "bg-white/10 text-[#f0e7d5]",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 md:py-28 max-w-[1180px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-14"
      >
        <span className="text-[10px] font-bold tracking-[2px] text-[#6b7280] uppercase">
          HOW IT WORKS
        </span>
        <h2 className="text-[clamp(28px,4vw,38px)] font-extrabold tracking-tight mt-2 text-[#17191d]">
          Three steps to <span className="text-[#1b5e48]">the top</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className={`relative p-8 rounded-[32px] flex flex-col justify-between min-h-[260px] shadow-sm hover:shadow-md transition-all duration-300 ${s.bg} ${s.textColor}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span className={`text-[10px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full ${s.tagBg}`}>
                    {s.label}
                  </span>
                  <span className="text-xs font-extrabold opacity-60">
                    STEP {s.step}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold mb-2.5 tracking-tight leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs font-medium opacity-80 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.tagBg}`}>
                  <Icon size={18} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
