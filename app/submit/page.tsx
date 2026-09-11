"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Link2, AlertCircle, Sparkles, CheckCircle2, X } from "lucide-react";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SubmitPage() {
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
    setTimeout(() => inputRef.current?.focus(), 250);
  }, []);

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

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err: any) {
      setError("Network error. Please check your connection.");
      triggerShake();
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf8f3] text-[#17191d] relative overflow-x-hidden selection:bg-[#1f2a44]/15 selection:text-[#17191d]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 min-h-[80vh] flex items-center justify-center">
        <div className={`relative w-full max-w-xl mx-auto ${shake ? "animate-shake" : ""}`}>
          
          {/* Form Card */}
          <div className="relative bg-[#1f2a44] border border-black/8 rounded-[32px] p-7 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            {/* Close Button */}
            {!success && (
              <button
                onClick={() => window.location.href = "/"}
                className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all cursor-pointer z-10"
                aria-label="Cancel submission"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            )}

            {success ? (
              <div className="py-20 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#cfe9de] text-[#1b5e48] flex items-center justify-center mb-6">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Link Submitted!</h3>
                <p className="text-sm text-[#9ca3af] font-medium max-w-xs">
                  Your project has been listed on the leaderboard with 1 upvote. Redirecting...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2 text-[#8eb69b]">
                  <Sparkles size={18} />
                  <span className="text-[11px] font-bold tracking-[2px] uppercase">
                    FREE SUBMISSION
                  </span>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                  Submit Your Link
                </h2>
                <p className="text-sm text-[#9ca3af] font-medium mb-8">
                  Add your SaaS, X profile, blog, or project. Anyone can upvote it to #1.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#fbf8f3] uppercase tracking-wider mb-2">
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
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#fbf8f3] border border-black/8 text-sm text-[#17191d] placeholder:text-[#9ca3af] focus:bg-white focus:border-[#1f2a44] outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#fbf8f3] uppercase tracking-wider mb-2">
                      Link / URL *
                    </label>
                    <div className="relative">
                      <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                      <input
                        type="text"
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                        placeholder="x.com/handle, https://site.com, etc."
                        required
                        className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#fbf8f3] border border-black/8 text-sm text-[#17191d] placeholder:text-[#9ca3af] focus:bg-white focus:border-[#1f2a44] outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#fbf8f3] uppercase tracking-wider mb-2">
                      Tagline / Pitch <span className="text-[#9ca3af] font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="A brief 1-liner describing your project"
                      maxLength={200}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#fbf8f3] border border-black/8 text-sm text-[#17191d] placeholder:text-[#9ca3af] focus:bg-white focus:border-[#1f2a44] outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#fbf8f3] uppercase tracking-wider mb-2">
                      Contact Email <span className="text-[#9ca3af] font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maker@domain.com"
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#fbf8f3] border border-black/8 text-sm text-[#17191d] placeholder:text-[#9ca3af] focus:bg-white focus:border-[#1f2a44] outline-none transition-all font-medium"
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2 px-5 py-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700"
                      >
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-semibold">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => window.location.href = "/"}
                      className="flex-1 py-4 rounded-2xl bg-[#f5f0e6] border-2 border-transparent text-[#17191d] font-bold text-sm hover:bg-[#e8dcc8] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#DFB6B2] !text-[#17191d] font-extrabold tracking-wide text-sm hover:brightness-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-md"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Listing project…
                        </>
                      ) : (
                        <>
                          Submit & Launch
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
