"use client";

import { useState, useEffect } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Leaderboard from "@/components/Leaderboard";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ClaimSpotForm from "@/components/ClaimSpotForm";

export default function HomePage() {
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
    });

    return () => lenis.destroy();
  }, []);

  return (
    <main className="min-h-screen bg-[#fbf8f3] text-[#17191d] relative overflow-x-hidden selection:bg-[#1f2a44]/15 selection:text-[#17191d]">
      <Navbar onClaimClick={() => setFormOpen(true)} />
      <HeroSection onClaimClick={() => setFormOpen(true)} />
      <Leaderboard />
      <HowItWorks />
      <CTASection onClaimClick={() => setFormOpen(true)} />
      <Footer />
      <ClaimSpotForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </main>
  );
}
