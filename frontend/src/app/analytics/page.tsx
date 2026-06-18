"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const datasets = {
  teja: {
    title: "Premium Teja Red Chilli Trend",
    desc: "Average global spot price per quintal (6 Months)",
    data: [
      { month: "Jan", price: 12500 }, { month: "Feb", price: 13200 }, { month: "Mar", price: 14100 },
      { month: "Apr", price: 13800 }, { month: "May", price: 14500 }, { month: "Jun", price: 15000 },
    ],
    insights: ["Volatility Index: Low", "Supply Forecast: Stable", "Global Demand: High"]
  },
  sannam: {
    title: "Guntur Sannam Chilli Trend",
    desc: "Average spot price for Guntur Sannam (6 Months)",
    data: [
      { month: "Jan", price: 11000 }, { month: "Feb", price: 10800 }, { month: "Mar", price: 11200 },
      { month: "Apr", price: 11800 }, { month: "May", price: 12100 }, { month: "Jun", price: 12500 },
    ],
    insights: ["Volatility Index: Medium", "Supply Forecast: Surplus", "Global Demand: Moderate"]
  },
  byadagi: {
    title: "Byadagi Chilli Trend",
    desc: "Premium color chilli price trends (6 Months)",
    data: [
      { month: "Jan", price: 18500 }, { month: "Feb", price: 19200 }, { month: "Mar", price: 19800 },
      { month: "Apr", price: 20500 }, { month: "May", price: 21000 }, { month: "Jun", price: 22500 },
    ],
    insights: ["Volatility Index: High", "Supply Forecast: Tight", "Global Demand: Very High"]
  }
};

export default function AnalyticsPage() {
  const [selectedProduct, setSelectedProduct] = useState("teja");
  const currentDataset = datasets[selectedProduct as keyof typeof datasets];

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Market Analytics</h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light">
            AI-driven insights and historical price trends to help you make informed trading decisions.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-card border border-white/5 rounded-3xl p-8 shadow-2xl"
        >
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{currentDataset.title}</h2>
              <p className="text-muted-foreground">{currentDataset.desc}</p>
            </div>
            <select 
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-secondary/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary w-full md:w-auto"
            >
              <option value="teja">Premium Teja Chilli</option>
              <option value="sannam">Guntur Sannam Chilli</option>
              <option value="byadagi">Byadagi Chilli</option>
            </select>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentDataset.data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {currentDataset.insights.map((insight, i) => (
            <motion.div 
              key={`${selectedProduct}-${i}`} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="p-6 rounded-2xl bg-secondary/30 border border-white/5 font-medium text-center"
            >
              {insight}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}