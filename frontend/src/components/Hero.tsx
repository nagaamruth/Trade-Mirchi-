"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import ParticleBackground from "./ParticleBackground";
import { ArrowRight, Leaf, BarChart3, LineChart, ShieldCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const { user } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", delay: 0.2 }
      );
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-background pt-24 md:pt-32 pb-20"
    >
      <ParticleBackground />
      
      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background z-0" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary backdrop-blur-md"
        >
          <Leaf className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide">
            The Future of Global Agriculture
          </span>
        </motion.div>

        <h1
          ref={textRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-6"
        >
          Trade <span className="text-primary">Mirchi</span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-10 font-light"
        >
          AI-Powered Smart Agricultural Marketplace & Business Management Platform. Connect, Trade, and Scale with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <button onClick={() => window.location.href = '/products'} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-14 rounded-full shadow-[0_0_40px_-10px_rgba(255,107,0,0.5)]">
            Explore Marketplace <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          {mounted && !user && (
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full border-white/10 hover:bg-white/5 backdrop-blur-md" onClick={() => window.location.href = '/register'}>
              Partner With Us
            </Button>
          )}
        </motion.div>

        {/* Dashboard Preview Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          className="w-full max-w-4xl relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative border border-white/10 bg-card/40 backdrop-blur-xl rounded-2xl p-4 shadow-2xl overflow-hidden">
            {/* Fake Dashboard Header */}
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="ml-4 h-4 w-48 bg-white/5 rounded-full" />
            </div>
            
            {/* Fake Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-secondary/30 rounded-xl p-6 border border-white/5 flex flex-col justify-between min-h-[200px]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Market Trend Analysis</h3>
                    <div className="text-2xl font-bold mt-1">Premium Teja</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <LineChart className="w-5 h-5" />
                  </div>
                </div>
                {/* Fake Chart Lines */}
                <div className="w-full flex items-end gap-2 h-24 opacity-60">
                  {[40, 25, 45, 30, 60, 50, 75, 40, 85, 70, 95].map((height, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: 1.5 + (i * 0.1) }}
                      className="flex-1 bg-gradient-to-t from-primary/20 to-primary rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-secondary/30 rounded-xl p-5 border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">Quality Assurance</h3>
                  <div className="h-2 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} transition={{ duration: 1.5, delay: 2 }} className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-xl p-5 border border-white/5 flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">Trading Volume</h3>
                  <div className="text-3xl font-bold mt-2">12.4k <span className="text-sm font-normal text-muted-foreground">tons</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
