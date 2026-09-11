"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Leaderboard from "@/components/Leaderboard";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
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
      <Navbar />
      <HeroSection />
      <Leaderboard />
      <CTASection />
      <Footer />
    </main>
  );
}
