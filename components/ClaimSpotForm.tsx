"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Loader2, Link2, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import gsap from "gsap";

interface ClaimSpotFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function ClaimSpotForm({ isOpen, onClose, onSubmitted }: ClaimSpotFormProps) {
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 250);
      
      // Safe GSAP Animation for Rules using context
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".gsap-rule-item",
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out", clearProps: "all" }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productName.trim()) {
      setError("Please enter a title or name for your link.");
      triggerShake();
      return;
    }

    if (!productUrl.trim()) {
      setError("Please enter a URL or handle (e.g. x.com/username or your website).");
      triggerShake();
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: productName.trim(),
          product_url: productUrl.trim(),
          tagline: tagline.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Submission failed. Please try again.");
        triggerShake();
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setSubmitting(false);
      onSubmitted?.();

      setTimeout(() => {
        onClose();
        setProductName("");
        setProductUrl("");
        setTagline("");
        setEmail("");
        setSuccess(false);
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setError("Network error. Please check your connection.");
      triggerShake();
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className={`relative flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] pointer-events-auto gap-4 ${shake ? "animate-shake" : ""}`}>
              
              {/* Form Card */}
              <div className="flex-1 bg-white border border-black/8 rounded-[32px] p-7 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.14)] overflow-y-auto">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 md:hidden p-2 rounded-full text-[#6b7280] hover:text-[#17191d] hover:bg-[#f5f0e6] transition-colors cursor-pointer z-10"
                >
                  <X size={18} />
                </button>

                {success ? (
                  <div className="py-10 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-[#cfe9de] text-[#1b5e48] flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#17191d] mb-1">Link Submitted!</h3>
                    <p className="text-xs text-[#6b7280] font-medium max-w-xs">
                      Your project has been listed on the leaderboard with 1 upvote.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-extrabold tracking-tight text-[#17191d] mb-1">
                      Submit Your Link
                    </h2>
                    <p className="text-xs text-[#6b7280] font-medium mb-6">
                      Add your SaaS, X profile, blog, or project. Anyone can upvote it to #1.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#17191d] uppercase tracking-wider mb-1.5">
                          Project / Creator Name *
                        </label>
                        <input
                          ref={inputRef}
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="e.g. Acme AI or @alex_builds"
                          maxLength={100}
                          required
                          className="w-full px-4 py-3 rounded-2xl bg-[#fbf8f3] border border-black/8 text-sm text-[#17191d] placeholder:text-[#9ca3af] focus:bg-white focus:border-[#1f2a44] outline-none transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#17191d] uppercase tracking-wider mb-1.5">
                          Link / URL *
                        </label>
                        <div className="relative">
                          <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                          <input
                            type="text"
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            placeholder="x.com/handle, https://site.com, etc."
                            required
                            className="w-full pl-9 pr-4 py-3 rounded-2xl bg-[#fbf8f3] border border-black/8 text-sm text-[#17191d] placeholder:text-[#9ca3af] focus:bg-white focus:border-[#1f2a44] outline-none transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#17191d] uppercase tracking-wider mb-1.5">
                          Tagline / Pitch <span className="text-[#9ca3af] font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          placeholder="A brief 1-liner describing your project"
                          maxLength={200}
                          className="w-full px-4 py-3 rounded-2xl bg-[#fbf8f3] border border-black/8 text-sm text-[#17191d] placeholder:text-[#9ca3af] focus:bg-white focus:border-[#1f2a44] outline-none transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#17191d] uppercase tracking-wider mb-1.5">
                          Contact Email <span className="text-[#9ca3af] font-normal">(optional)</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="maker@domain.com"
                          className="w-full px-4 py-3 rounded-2xl bg-[#fbf8f3] border border-black/8 text-sm text-[#17191d] placeholder:text-[#9ca3af] focus:bg-white focus:border-[#1f2a44] outline-none transition-all font-medium"
                        />
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700"
                          >
                            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                            <p className="text-xs font-semibold">{error}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#1f2a44] text-[#fbf8f3] font-bold text-sm hover:bg-[#151c30] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-md mt-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Listing project…
                          </>
                        ) : (
                          <>
                            Submit & Launch
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Rules Card / How It Works */}
              <div className="hidden md:flex flex-1 flex-col bg-[#fbf8f3] border border-black/8 rounded-[32px] p-7 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.14)] overflow-y-auto relative">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full text-[#6b7280] hover:text-[#17191d] hover:bg-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
                <div className="gsap-rules-card h-full">
                  <h3 className="text-lg font-bold text-[#17191d] mb-4">What you can list</h3>
                  <ul className="space-y-4 text-sm text-[#4b5563]">
                    <li className="gsap-rule-item flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1b5e48] mt-1.5 flex-shrink-0" />
                      <p>A product website, or an X @handle.</p>
                    </li>
                    <li className="gsap-rule-item flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1b5e48] mt-1.5 flex-shrink-0" />
                      <p><strong>Chat and invite links are not allowed</strong> — Telegram, WhatsApp, Discord, Messenger, Signal, and similar. The board is for products and profiles, not group chats.</p>
                    </li>
                    <li className="gsap-rule-item flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <p><strong>Links to sexual content are not allowed.</strong> If it is porn, NSFW, or an adult platform, it does not belong on the board.</p>
                    </li>
                    <li className="gsap-rule-item flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1b5e48] mt-1.5 flex-shrink-0" />
                      <p><strong>Query parameters are stripped</strong> from listing links. Affiliate, referral, and tracking URLs will not work.</p>
                    </li>
                    <li className="gsap-rule-item flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1b5e48] mt-1.5 flex-shrink-0" />
                      <p><strong>Link shortener URLs are not allowed.</strong> If you submit one, it is replaced by the URL it redirects to.</p>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
