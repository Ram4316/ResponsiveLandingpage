"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: "How fast can we integrate Niemon into our stack?", a: "Most teams are up and running within 48 hours. Our SDKs for Python, Node.js, and Go are designed for immediate plug-and-play." },
    { q: "Do you train on our proprietary data?", a: "No. Your data is isolated and ephemeral. We utilize a zero-retention policy for all enterprise deployments, meaning your prompts and outputs are yours alone." },
    { q: "What is the baseline latency?", a: "Our global edge network guarantees sub-50ms latency for 95% of requests globally." },
    { q: "Can we deploy on-premises?", a: "Yes, our Enterprise tier includes full on-premise deployment options compatible with AWS, GCP, and bare-metal environments." },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 relative z-10">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Questions?</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className="text-white font-medium text-lg">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>

              <div
                className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${open === i ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-white/60 font-light">{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
