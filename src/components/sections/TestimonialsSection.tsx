"use client";

import { motion } from "framer-motion";

export function TestimonialsSection() {
  return (
    <section className="py-32 relative z-10 overflow-hidden">
       {/* Background gradient blur */}
       <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

       <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white">Trusted by pioneers</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { quote: "Niemon completely overhauled our data pipeline. What used to take our analysts three weeks is now done autonomously in 40 seconds.", author: "Sarah Jenkins", role: "CTO, Nexus Corp" },
               { quote: "The most intuitive AI platform we've integrated. It felt like it understood our codebase better than we did within the first week.", author: "David Chen", role: "VP Engineering, Synthetix" },
               { quote: "Finally, an AI solution that doesn't compromise on security. We passed our enterprise audits with zero friction.", author: "Elena Rostova", role: "CISO, GlobalTech" },
             ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="glass-panel p-8 rounded-3xl"
                >
                   <div className="text-primary text-4xl font-serif mb-4">&quot;</div>
                   <p className="text-white/80 font-light mb-8 text-lg leading-relaxed">{t.quote}</p>
                   <div>
                     <div className="text-white font-medium">{t.author}</div>
                     <div className="text-white/40 text-sm">{t.role}</div>
                   </div>
                </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}
