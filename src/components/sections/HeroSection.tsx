"use client";

import { motion } from "framer-motion";
import { OrbCanvas } from "@/components/ui/OrbCanvas";
import { Mouse } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-20 flex flex-col lg:flex-row items-center">

        {/* Left Side: Copy */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center mt-20 lg:mt-0 relative z-30 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-primary font-mono text-sm tracking-widest uppercase">
                CODE NAME: NIEMON
              </span>
              <div className="h-[1px] w-12 bg-primary/50" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white mb-8 tracking-tight"
          >
            We provide AI <br />
            that can literally <br />
            change your life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/60 max-w-md mb-12 font-light leading-relaxed"
          >
            AI could deliver significant productivity gains in data extraction, automation, analysis and reporting.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,123,84,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-10 py-4 rounded-full font-medium tracking-wide transition-all"
          >
            GET STARTED
          </motion.button>
        </div>

        {/* Right Side: Orb Canvas (Desktop: absolute right half, Mobile: absolute behind text) */}
        <div className="absolute inset-0 lg:relative lg:w-1/2 h-[60vh] lg:h-screen flex items-center justify-center opacity-40 lg:opacity-100 pointer-events-none mt-20 lg:mt-0">
          <div className="relative w-full h-full max-w-[800px] max-h-[800px]">
             {/* Dynamic Orb Component */}
             <OrbCanvas />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 z-20 pointer-events-none hidden md:flex"
      >
        <Mouse className="w-5 h-5 animate-bounce" />
      </motion.div>

      {/* Bottom Left Navigation Indicator (from ref image) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-6 md:left-12 text-white/50 font-mono text-sm z-20 hidden md:block"
      >
        1/ <br />
        <span className="text-white">Product</span>
      </motion.div>

      {/* Bottom Right Dots (from ref image) */}
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 2, duration: 1 }}
         className="absolute bottom-10 right-6 md:right-12 flex flex-col gap-3 z-20 hidden md:flex"
      >
        <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
        <div className="w-3 h-3 rounded-full border border-white/30" />
        <div className="w-3 h-3 rounded-full border border-white/30" />
      </motion.div>
    </section>
  );
}
