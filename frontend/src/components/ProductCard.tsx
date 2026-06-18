import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useStore } from "@/store/useStore";
import Link from "next/link";

export interface Product {
  _id: string;
  name: string;
  category: string;
  currentPrice: number;
  images: string[];
  origin: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<"Grams" | "KG" | "Quintal" | "Ton">("KG");

  const { data: settings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/settings");
      return res.data.settings;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden bg-card border-white/5 hover:border-white/20 transition-colors group flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-secondary/50 shrink-0">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-2 py-1 rounded text-xs font-medium border border-white/10">
            {product.category}
          </div>
        </div>
        <CardContent className="p-6 pb-4 flex-1 flex flex-col">
          <div className="text-sm text-muted-foreground mb-1">{product.origin}</div>
          <h3 className="font-semibold text-xl mb-2 text-foreground line-clamp-2 min-h-[56px]">{product.name}</h3>
          <div className="text-2xl font-bold text-primary mt-auto">₹{product.currentPrice.toLocaleString("en-IN")}<span className="text-sm font-normal text-muted-foreground">/KG</span></div>
          
          <div className="flex items-center gap-2 mt-4">
            <input 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="w-16 bg-secondary/50 border border-white/10 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
            <select 
              value={unit} 
              onChange={(e) => setUnit(e.target.value as any)}
              className="flex-1 bg-secondary/50 border border-white/10 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
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
        </CardContent>
        <CardFooter className="p-6 pt-0 flex gap-3 shrink-0">
          <Link href={`/products/${product._id}`} className="w-full">
            <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              Details
            </Button>
          </Link>
          <Button 
            className="w-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
            onClick={() => {
              const store = useStore.getState();
              if (!store.user) {
                window.location.href = "/login";
                return;
              }
              addToCart(product, quantity, unit);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Add
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
