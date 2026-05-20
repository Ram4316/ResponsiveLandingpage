"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { DashboardMockupSection } from "@/components/sections/DashboardMockupSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <div className={`transition-opacity duration-1000 ${loadingComplete ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <Navbar />
        <main className="flex min-h-screen flex-col w-full overflow-hidden">
            <HeroSection />
            <DashboardMockupSection />
            <FeaturesSection />
            <TestimonialsSection />
            <PricingSection />
            <FAQSection />
            <Footer />
        </main>
      </div>

      {!loadingComplete && <LoadingScreen onComplete={() => setLoadingComplete(true)} />}
    </>
  );
}
