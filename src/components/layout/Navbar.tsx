"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Product", href: "#" },
  { name: "Contact us", href: "#" },
  { name: "Projects", href: "#" },
  { name: "News", href: "#" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "py-4 bg-background/80 backdrop-blur-md border-b border-white/5" : "py-8"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tight flex items-center gap-1 group">
          nei.co
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item, i) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-white/70 hover:text-white transition-colors relative group"
            >
              {item.name}
              {i === 0 && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center">
          <Link
            href="#"
            className="px-6 py-2.5 rounded-full border border-white/20 text-sm font-medium text-white hover:bg-white hover:text-background transition-all duration-300"
          >
            TRY OUR AI
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
