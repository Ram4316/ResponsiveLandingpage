"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { OrbCanvas } from "@/components/ui/OrbCanvas";
import { Mouse } from "lucide-react";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 180, damping: 28, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 180, damping: 28, mass: 0.4 });
  const cursorXPx = useTransform(springX, (value) => `${value}px`);
  const cursorYPx = useTransform(springY, (value) => `${value}px`);

  useEffect(() => {
    const setToCenter = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      cursorX.set(rect.width / 2);
      cursorY.set(rect.height / 2);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      cursorX.set(event.clientX - rect.left);
      cursorY.set(event.clientY - rect.top);
    };

    setToCenter();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", setToCenter);
    window.addEventListener("blur", setToCenter);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", setToCenter);
      window.removeEventListener("blur", setToCenter);
    };
  }, [cursorX, cursorY]);

  const cursorStyle = {
    "--cursor-x": cursorXPx,
    "--cursor-y": cursorYPx,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[95svh] w-full flex items-center pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={cursorStyle}>
        <div
          className="absolute inset-0 opacity-80 blur-3xl mix-blend-screen"
          style={{
            background:
              "radial-gradient(520px circle at var(--cursor-x) var(--cursor-y), rgba(108, 53, 222, 0.38), rgba(11, 1, 33, 0) 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60 blur-2xl"
          style={{
            background:
              "radial-gradient(900px circle at 70% 20%, rgba(255, 123, 84, 0.2), rgba(11, 1, 33, 0) 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-50 blur-2xl"
          style={{
            background:
              "radial-gradient(850px circle at 30% 85%, rgba(108, 53, 222, 0.2), rgba(11, 1, 33, 0) 75%)",
          }}
        />
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 relative z-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

        {/* Left Side: Copy */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center mt-8 lg:mt-0 relative z-30 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="mb-4"
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white mb-6 tracking-tight max-w-xl"
          >
            We provide AI <br />
            that can literally <br />
            change your life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
            className="text-base md:text-lg text-white/60 max-w-lg mb-8 font-light leading-relaxed"
          >
            AI-driven automation for analytics, workflows, and intelligent decision-making.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,123,84,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-10 py-4 rounded-full font-medium tracking-wide transition-all shadow-[0_15px_45px_rgba(255,123,84,0.25)]"
          >
            GET STARTED
          </motion.button>
        </div>

        {/* Right Side: Orb Canvas (Desktop: absolute right half, Mobile: absolute behind text) */}
        <div className="absolute inset-0 lg:relative lg:w-1/2 h-[55vh] md:h-[60vh] lg:h-[80vh] flex items-center justify-center opacity-70 lg:opacity-100 pointer-events-none mt-10 lg:mt-0">
          <div className="relative w-full h-full max-w-[780px] max-h-[780px]">
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
