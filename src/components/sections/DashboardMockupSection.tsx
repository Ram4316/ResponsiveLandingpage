"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Box, Cpu, LineChart, Network, Server, Zap } from "lucide-react";

export function DashboardMockupSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-purple-light/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Cpu className="w-5 h-5 text-primary" />
            <span className="text-primary font-mono text-sm tracking-widest uppercase">
              Command Center
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Real-time Neural Analytics
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-white/60 font-light"
          >
            Monitor AI performance, data throughput, and automation metrics through a beautifully crafted, low-latency interface.
          </motion.p>
        </div>

        {/* Dashboard UI Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#130630]/80 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Mac-style Window Controls */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="ml-4 text-xs font-mono text-white/40">niemon-os // analytics-engine</div>
          </div>

          {/* Dashboard Grid Content */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {/* Sidebar */}
            <div className="hidden lg:flex flex-col gap-2 border-r border-white/5 pr-6">
              {[
                { icon: BarChart3, label: "Overview", active: true },
                { icon: Network, label: "Neural Net", active: false },
                { icon: Activity, label: "Throughput", active: false },
                { icon: Box, label: "Models", active: false },
                { icon: Server, label: "Infrastructure", active: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                    item.active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col gap-6">

              {/* Top Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Total Processing", value: "8.4 TB/s", change: "+14%", positive: true },
                  { label: "Active Models", value: "24", change: "Optimal", positive: true },
                  { label: "Latency", value: "12ms", change: "-2ms", positive: true },
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
                    <div className="text-sm text-white/50 mb-2">{stat.label}</div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className={`text-xs font-mono ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Chart Area */}
              <div className="glass-panel p-6 rounded-2xl h-64 relative flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white/80 text-sm font-medium">Throughput Over Time</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-white/50 font-mono">LIVE</span>
                  </div>
                </div>

                {/* CSS Mockup Chart Lines */}
                <div className="flex-1 relative flex items-end justify-between gap-2 px-2 pb-2 border-b border-l border-white/10">
                   {/* Generating mock bars for visual effect */}
                   {Array.from({ length: 30 }).map((_, i) => {
                     // Using pseudo-random but deterministic height based on index to satisfy purity
                     const pseudoRandom = Math.sin(i * 123.45) * 0.5 + 0.5; // 0 to 1
                     const height = 20 + pseudoRandom * 60;
                     return (
                       <motion.div
                         key={i}
                         initial={{ height: 0 }}
                         whileInView={{ height: `${height}%` }}
                         viewport={{ once: true }}
                         transition={{ duration: 1, delay: i * 0.02 }}
                         className="w-full bg-gradient-to-t from-purple-light/20 to-purple-light/60 rounded-t-sm"
                       />
                     );
                   })}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium mb-1">Automation Engine Active</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Neural pathways optimized. 4,203 tasks automated in the last hour. Efficiency up by 32%.
                    </p>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-light/20 flex items-center justify-center shrink-0">
                    <LineChart className="w-5 h-5 text-purple-light" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium mb-1">Predictive Models Updated</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Core dataset successfully merged with Q3 projections. Accuracy confidence at 99.4%.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
