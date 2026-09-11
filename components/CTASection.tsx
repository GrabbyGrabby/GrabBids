"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-4 py-24 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#1f2a44] text-[#fbf8f3] rounded-[40px] md:rounded-[48px] p-10 md:p-20 relative overflow-hidden shadow-2xl"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-[clamp(32px,5vw,56px)] font-extrabold tracking-tight leading-[1.05] mb-6">
              Ready to climb the <br className="hidden sm:block" />
              <span className="text-[#c6a75e]">community board?</span>
            </h2>
            
            <p className="text-white/60 text-sm md:text-base font-medium max-w-lg mx-auto mb-10">
              Submit your project today. It's completely free, requires no signup, and takes less than 30 seconds.
            </p>

            <a
              href="/submit"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#EBE4D5] !text-[#17191d] font-bold tracking-tight text-[15px] hover:bg-[#DFD8C7] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-xl cursor-pointer"
            >
              List your product
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
