"use client";

import { motion } from "framer-motion";
import { Leaf, Award, Globe, Shield } from "lucide-react";

const stats = [
  { value: "$500M+", label: "Annual Trade Volume" },
  { value: "50+", label: "Countries Served" },
  { value: "10k+", label: "Verified Partners" },
  { value: "99.9%", label: "Platform Uptime" },
];

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "Every transaction is secured, verified, and logged immutably." },
  { icon: Globe, title: "Global Reach", desc: "Connecting local farmers to international enterprise buyers seamlessly." },
  { icon: Award, title: "Premium Quality", desc: "Strict quality control parameters ensuring only export-grade commodities." },
  { icon: Leaf, title: "Sustainable Growth", desc: "Promoting ethical farming and fair trade practices worldwide." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Redefining Global <br /><span className="text-primary">Agri-Trade</span></h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Trade Mirchi is an AI-powered enterprise platform designed to eliminate friction in international agricultural supply chains. We bring Silicon Valley tech to traditional farming.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-card/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }} 
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">The principles that drive our marketplace.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl border border-white/5 bg-card hover:bg-white/5 transition-colors flex gap-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{val.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  );
}