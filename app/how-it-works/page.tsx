"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f3] text-[#17191d] relative overflow-x-hidden selection:bg-[#1f2a44]/15 selection:text-[#17191d]">
      <Navbar />
      <div className="pt-32 pb-16">
        <HowItWorks />
      </div>
      <Footer />
    </main>
  );
}
