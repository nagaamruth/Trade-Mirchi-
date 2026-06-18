"use client";

import Hero from "@/components/Hero";
import { ArrowRight, Brain, Globe, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HomeActions from "@/components/HomeActions";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-hidden">
      <Hero />
      
      {/* SECTION 1: Core Philosophy */}
      <section className="w-full py-32 px-6 md:px-10 bg-background relative border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-tight mb-8">
            {t("hero_title")}
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            {t("hero_subtitle")}
          </p>
        </div>

        {/* Company Statistics */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-secondary/20 rounded-2xl border border-white/5">
            <div className="text-4xl font-bold text-primary mb-2">25+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center p-6 bg-secondary/20 rounded-2xl border border-white/5">
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-sm text-muted-foreground">Tons Handled Yearly</div>
          </div>
          <div className="text-center p-6 bg-secondary/20 rounded-2xl border border-white/5">
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <div className="text-sm text-muted-foreground">Trusted Clients</div>
          </div>
          <div className="text-center p-6 bg-secondary/20 rounded-2xl border border-white/5">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Quality Guarantee</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: AI-Powered Insights */}
      <section className="w-full py-32 px-6 md:px-10 bg-secondary/20 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full z-0" />
            <div className="relative z-10 bg-card border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Smart Pricing Engine</h3>
                  <p className="text-muted-foreground">Real-time market analysis</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">Instant Price Predictions</h4>
                    <p className="text-muted-foreground text-sm">Our AI analyzes historical data, weather patterns, and global demand to predict price fluctuations before they happen.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">Global Arbitrage Alerts</h4>
                    <p className="text-muted-foreground text-sm">Get notified when there are profitable trading opportunities across different regional markets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Artificial Intelligence</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Trade Smarter, Not Harder.
            </h2>
            <blockquote className="border-l-4 border-primary pl-6 py-2 my-8">
              <p className="text-2xl text-muted-foreground italic font-light">
                "Data isn't just numbers on a screen; it's the future of your harvest and the foundation of your profit."
              </p>
            </blockquote>
            <Link href="/analytics">
              <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg">
                View Live Analytics <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: Trust & Quality Grid */}
      <section className="w-full py-32 px-6 md:px-10 bg-background relative border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Premium Commission Services</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Based in Malakpet Mirchi Market, we connect farmers with global exporters through state-of-the-art infrastructure.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-secondary/30 border border-white/5 p-8 rounded-3xl hover:bg-secondary/50 transition-colors">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">ASTA Certified Quality</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              All red chilli lots undergo rigorous moisture and color value testing (SHU/ASTA). We guarantee the grade you buy is the grade you receive.
            </p>
          </div>
          <div className="bg-secondary/30 border border-white/5 p-8 rounded-3xl hover:bg-secondary/50 transition-colors">
            <Brain className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-xl font-bold mb-3">AC & Godown Storage</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We provide massive climate-controlled cold storage to retain the vibrant color and pungency of your Guntur Sannam and Teja varieties.
            </p>
          </div>
          <div className="bg-secondary/30 border border-white/5 p-8 rounded-3xl hover:bg-secondary/50 transition-colors">
            <Globe className="w-10 h-10 text-blue-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">Export Logistics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              From Malakpet to international ports. We handle container packing, phytosanitary coordination, and fumigation support for seamless exports.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center bg-card border border-white/10 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
            "The market waits for no one. Secure your supply today."
          </h2>
          <div className="flex justify-center relative z-10 mt-8">
            <HomeActions />
          </div>
        </div>
      </section>
    </main>
  );
}
