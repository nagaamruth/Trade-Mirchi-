"use client";

import { motion } from "framer-motion";
import { Globe2, ShieldCheck, Truck } from "lucide-react";

const partners = [
  { name: "AgriExport India", location: "Mumbai, India", type: "Verified Exporter", volume: "12,000 MT/yr" },
  { name: "Global Spices Hub", location: "Dubai, UAE", type: "Premium Buyer", volume: "8,500 MT/yr" },
  { name: "EuroTrade Foods", location: "Rotterdam, NL", type: "Premium Buyer", volume: "15,000 MT/yr" },
  { name: "Kerala Spice Co.", location: "Kochi, India", type: "Verified Supplier", volume: "4,200 MT/yr" },
  { name: "Mekong Rice Traders", location: "Vietnam", type: "Verified Exporter", volume: "45,000 MT/yr" },
  { name: "US Agri Importers", location: "New York, USA", type: "Premium Buyer", volume: "22,000 MT/yr" },
];

export default function NetworkPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-20">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Globe2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">Global Trade Network</h1>
          <p className="text-xl text-muted-foreground font-light">
            Connect with verified, high-volume buyers and suppliers across 50+ countries. Every partner undergoes strict KYC and quality compliance checks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl border border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-white/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-xl text-foreground">
                  {partner.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{partner.name}</h3>
              <p className="text-muted-foreground mb-6 flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> {partner.location}
              </p>
              
              <div className="pt-6 border-t border-white/10 flex justify-between items-center text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Trade Capacity</p>
                  <p className="font-bold flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> {partner.volume}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground mb-1">Role</p>
                  <p className="font-medium text-primary">{partner.type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}