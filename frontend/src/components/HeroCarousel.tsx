"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// In the future, this data will come from the Admin API
const defaultCarouselItems = [
  {
    id: 1,
    title: "Premium Red Chilli (Teja)",
    subtitle: "High pungency, deep red color.",
    gradient: "from-red-900/40 via-red-900/10 to-transparent",
    bgImage: "https://images.unsplash.com/photo-1596649282717-54c34a17ed9f?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Fresh Turmeric",
    subtitle: "High curcumin content from Erode.",
    gradient: "from-yellow-900/40 via-yellow-900/10 to-transparent",
    bgImage: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Export Quality Spices",
    subtitle: "Certified global supply chain.",
    gradient: "from-emerald-900/40 via-emerald-900/10 to-transparent",
    bgImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2000&auto=format&fit=crop",
  },
];

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 mt-12"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {defaultCarouselItems.map((item) => (
          <CarouselItem key={item.id}>
            <Card className="border-0 bg-transparent rounded-none">
              <CardContent className="flex items-end justify-start h-[300px] sm:h-[400px] md:h-[500px] p-0 relative overflow-hidden group">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.bgImage})` }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient}`} />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                
                {/* Content */}
                <div className="relative z-10 p-8 sm:p-12 w-full">
                  <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-medium text-white mb-4 shadow-sm">
                    Featured Product
                  </div>
                  <h3 className="text-3xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-lg text-white/80 font-light max-w-md">
                    {item.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
