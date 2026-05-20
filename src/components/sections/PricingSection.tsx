"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing</h2>
          <p className="text-white/60">Scale your AI operations without limits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-10 rounded-[2rem] border-white/5"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-white/50 text-sm mb-8">For scaling startups</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">$499</span>
              <span className="text-white/50">/mo</span>
            </div>

            <ul className="space-y-4 mb-10">
              {["100M API Requests", "Custom Model Tuning", "Community Support", "Standard Latency"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <Check className="w-5 h-5 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-background transition-all">
              Get Started
            </button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2rem] bg-gradient-to-b from-purple-light/20 to-background border border-primary/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
            <p className="text-white/50 text-sm mb-8">For global deployments</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">Custom</span>
            </div>

            <ul className="space-y-4 mb-10">
              {["Unlimited API Requests", "On-Premises Deployment", "Dedicated AI Engineer", "Zero-Latency SLA"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <Check className="w-5 h-5 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-4 rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,123,84,0.3)]">
              Contact Sales
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
