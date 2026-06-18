"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TrendingUp } from "lucide-react";

export default function LivePriceTicker() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["public-settings"],
    queryFn: async () => {
      const res = await axios.get("/api/settings");
      return res.data.settings;
    }
  });

  if (isLoading || !settings?.liveRates || settings.liveRates.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-card/40 backdrop-blur-md border border-white/10 rounded-full overflow-hidden flex items-center shadow-xl">
      <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 flex items-center gap-2 font-semibold text-sm whitespace-nowrap z-10 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.5)]">
        <TrendingUp className="w-4 h-4" /> Live Market
      </div>
      <div className="flex-1 overflow-hidden relative flex items-center">
        {/* We use a repeating marquee effect */}
        <div className="flex whitespace-nowrap animate-marquee">
          {[...settings.liveRates, ...settings.liveRates, ...settings.liveRates].map((rate: any, i: number) => (
            <div key={i} className="flex items-center gap-2 px-6 sm:px-8 border-r border-white/10 last:border-0">
              <span className="text-sm text-muted-foreground">{rate.commodity}</span>
              <span className="text-sm font-bold text-primary">{rate.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
