"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Fingerprint, Lock, Sparkles } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Neural Architecture",
      description: "Our proprietary models adapt to your workflows in real-time, learning from every interaction.",
      icon: BrainCircuit,
      span: "col-span-1 md:col-span-2",
      gradient: "from-purple-light/20 to-transparent",
    },
    {
      title: "Bank-Grade Security",
      description: "Enterprise encryption standards ensuring your proprietary data never leaks into public models.",
      icon: Lock,
      span: "col-span-1",
      gradient: "from-primary/20 to-transparent",
    },
    {
      title: "Biometric Auth",
      description: "Frictionless access with zero-trust architecture.",
      icon: Fingerprint,
      span: "col-span-1",
      gradient: "from-blue-500/20 to-transparent",
    },
    {
      title: "Infinite Scalability",
      description: "Deploy globally in milliseconds. Our edge network ensures low latency everywhere.",
      icon: Sparkles,
      span: "col-span-1 md:col-span-2",
      gradient: "from-purple-dark/40 to-transparent",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Built for the future. <br className="hidden md:block" />
            <span className="text-white/40">Available today.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`glass-panel p-8 rounded-3xl relative overflow-hidden group ${feature.span}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <feature.icon className="w-8 h-8 text-white mb-6 relative z-10" />
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
              <p className="text-white/60 font-light relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
