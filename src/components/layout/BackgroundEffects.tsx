"use client";

import { motion } from "framer-motion";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glowing blobs */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-purple-light opacity-20 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
        className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#3b1c82] opacity-30 blur-[150px]"
      />
    </div>
  );
}
