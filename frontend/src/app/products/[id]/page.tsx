"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, MapPin, Package as PackageIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const { addToCart, user } = useStore();
  const router = useRouter();
  
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<"Grams" | "KG" | "Quintal" | "Ton">("KG");

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`/api/products/${id}`);
      return res.data.product;
    }
  });

  const { data: settings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/settings");
      return res.data.settings;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24">
        <h1 className="text-3xl font-bold text-destructive mb-4">Product Not Found</h1>
        <Button onClick={() => router.push("/products")} variant="outline">Back to Market</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    addToCart(data, quantity, unit);
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl overflow-hidden bg-secondary/30 border border-white/5 aspect-square relative"
          >
            {data.images && data.images.length > 0 ? (
              <img src={data.images[0]} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image Available</div>
            )}
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-xs font-medium border border-white/10">
                {data.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Source
              </span>
            </div>
          </motion.div>

          {/* Right Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{data.name}</h1>
            <p className="text-xl text-muted-foreground mb-8 font-light">{data.description}</p>
            
            <div className="text-4xl font-bold text-primary mb-8">
              ₹{data.currentPrice.toLocaleString("en-IN")} <span className="text-lg text-muted-foreground font-normal">/ KG</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-secondary/20 border border-white/5">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Origin</p>
                <p className="font-semibold">{data.origin || "Not specified"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/20 border border-white/5">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><PackageIcon className="w-4 h-4" /> Available Stock</p>
                <p className="font-semibold text-emerald-500">{data.stock} KG ({data.availableStockType === 'ac_storage' ? 'AC Storage' : 'Godown'})</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  className="w-20 bg-secondary/50 border border-white/10 rounded-full px-4 text-center focus:outline-none focus:border-primary"
                />
                <select 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="bg-secondary/50 border border-white/10 rounded-full px-4 focus:outline-none focus:border-primary"
                >
                  {(!settings || settings.allowRetailUnits) && (
                    <>
                      <option value="Grams">Grams</option>
                      <option value="KG">KG</option>
                    </>
                  )}
                  <option value="Quintal">Quintal</option>
                  <option value="Ton">Ton</option>
                </select>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1 h-14 text-lg rounded-full">
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="font-bold mb-4 text-xl">Quality & Specifications</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Variety</span> <span className="font-medium text-foreground">{data.variety || "Standard"}</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Grade</span> <span className="font-medium text-foreground">{data.grade || "Standard"}</span></li>
                {data.heatLevel && <li className="flex justify-between border-b border-white/5 pb-2"><span>Heat Level (SHU)</span> <span className="font-medium text-foreground">{data.heatLevel}</span></li>}
                {data.colorValue && <li className="flex justify-between border-b border-white/5 pb-2"><span>Color Value (ASTA)</span> <span className="font-medium text-foreground">{data.colorValue}</span></li>}
                {data.moisturePercentage && <li className="flex justify-between border-b border-white/5 pb-2"><span>Moisture</span> <span className="font-medium text-foreground">{data.moisturePercentage}%</span></li>}
                {data.stemPercentage && <li className="flex justify-between border-b border-white/5 pb-2"><span>Stem</span> <span className="font-medium text-foreground">{data.stemPercentage}%</span></li>}
                {data.packingSizes && data.packingSizes.length > 0 && <li className="flex justify-between border-b border-white/5 pb-2"><span>Packing Sizes</span> <span className="font-medium text-foreground">{data.packingSizes.join(', ')}</span></li>}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
