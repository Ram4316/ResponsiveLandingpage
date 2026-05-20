"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative z-10 pt-32 pb-12 overflow-hidden">
      {/* Large Glowing Footer Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-dark/30 blur-[200px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Massive CTA */}
        <div className="text-center mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-8"
          >
            Ready to <br />
            evolve?
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-background px-12 py-5 rounded-full font-bold tracking-wide text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            START DEPLOYING
          </motion.button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-white/10 pt-20">
          <div>
            <div className="text-white font-bold text-xl mb-6">nei.co</div>
            <p className="text-white/40 text-sm">AI that literally changes your life.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Product</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Company</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Legal</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-white/30 text-sm">
          <div>© 2026 Niemon AI. All rights reserved.</div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
