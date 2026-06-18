"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

const marketData = [
  { commodity: "Premium Teja Red Chilli", price: "₹18,500 / qtl", change: "+2.4%", trend: "up", volume: "4,500 MT" },
  { commodity: "Guntur Sannam Red Chilli", price: "₹14,500 / qtl", change: "-1.2%", trend: "down", volume: "2,100 MT" },
  { commodity: "Byadagi Red Chilli (Export)", price: "₹20,500 / qtl", change: "+0.8%", trend: "up", volume: "8,900 MT" },
  { commodity: "Kashmiri Red Chilli", price: "₹21,000 / qtl", change: "+4.1%", trend: "up", volume: "850 MT" },
  { commodity: "Sanki Red Chilli", price: "₹12,800 / qtl", change: "-0.5%", trend: "down", volume: "1,200 MT" },
  { commodity: "Devanur Red Chilli", price: "₹15,200 / qtl", change: "+5.2%", trend: "up", volume: "120 MT" },
];

export default function LivePricesPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-4 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Market Data
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Global Spot Prices</h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light">
            Real-time pricing for premium agricultural commodities aggregated from global verified mandis and export hubs.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary/30 text-muted-foreground text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-6 font-medium">Commodity</th>
                  <th className="px-8 py-6 font-medium">Spot Price</th>
                  <th className="px-8 py-6 font-medium">24h Change</th>
                  <th className="px-8 py-6 font-medium">24h Volume</th>
                  <th className="px-8 py-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-lg">
                {marketData.map((item, index) => {
                  const isUp = item.trend === "up";
                  return (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6 font-semibold flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isUp ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                          <TrendingUp className={`w-5 h-5 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`} />
                        </div>
                        {item.commodity}
                      </td>
                      <td className="px-8 py-6 font-bold">{item.price}</td>
                      <td className={`px-8 py-6 font-medium flex items-center gap-1 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isUp ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        {item.change}
                      </td>
                      <td className="px-8 py-6 text-muted-foreground">{item.volume}</td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => window.location.href = '/products'}
                          className="px-6 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          Buy
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}