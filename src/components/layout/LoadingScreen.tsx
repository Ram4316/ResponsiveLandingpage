"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 1000); // Wait for fade out
          }, 400);
          return 100;
        }
        // Accelerate towards the end
        const step = prev < 50 ? 2 : prev < 80 ? 4 : 8;
        return Math.min(prev + step, 100);
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          {/* Glowing orb in center */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mb-8 flex items-center justify-center"
          >
            <div className="absolute w-32 h-32 rounded-full bg-purple-light opacity-20 blur-[30px] animate-pulse" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-light to-primary relative z-10 shadow-[0_0_20px_rgba(108,53,222,0.5)]" />
          </motion.div>

          <div className="text-white/60 font-mono text-sm tracking-widest flex flex-col items-center gap-2">
            <div>INITIALIZING ENVIRONMENT</div>
            <div className="text-white text-2xl font-light tabular-nums">
              {progress.toString().padStart(3, "0")}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-[1px] bg-white/10 mt-6 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-primary"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
