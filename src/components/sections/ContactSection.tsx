"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send } from "lucide-react";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: replace with real form submission logic
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-32 relative z-10">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-light/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Get in touch
          </h2>
          <p className="text-white/50 text-lg font-light">
            Ready to transform your workflow? Reach out and we&apos;ll get back
            to you within 24 hours.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-3xl p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Send className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Message received!
            </h3>
            <p className="text-white/50 font-light">
              Thanks for reaching out. We&apos;ll be in touch shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-3xl p-8 md:p-12 space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm text-white/60 font-medium"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm text-white/60 font-medium"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm text-white/60 font-medium"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your project or ask us anything…"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(255,123,84,0.35)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-white font-medium tracking-wide transition-all"
            >
              Send Message
              <Send className="w-4 h-4" />
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
