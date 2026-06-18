"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartTotalKG } = useStore();

  const { data: settings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/settings");
      return res.data.settings;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-2xl bg-secondary/10"
          >
            <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🛒</span>
            </div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any products yet.</p>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">Browse Market</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, i) => (
                <motion.div 
                  key={`${item._id}-${item.unit}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl border border-white/10 bg-card items-center"
                >
                  <div className="w-full sm:w-32 h-32 rounded-xl bg-secondary overflow-hidden shrink-0">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs">No Image</div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category} • {item.origin}</p>
                    <div className="text-xl font-bold text-primary">₹{item.currentPrice.toLocaleString("en-IN")}<span className="text-sm font-normal text-muted-foreground">/KG</span></div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 border border-white/10 rounded-full px-2 py-1 bg-background">
                      <button 
                        onClick={() => updateQuantity(item._id, item.cartQuantity - 1, item.unit)}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.cartQuantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.cartQuantity + 1, item.unit)}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <select 
                      value={item.unit}
                      onChange={(e) => updateQuantity(item._id, item.cartQuantity, e.target.value as any, item.unit)}
                      className="bg-secondary/50 border border-white/10 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-primary w-full text-center"
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

                  <button 
                    onClick={() => removeFromCart(item._id, item.unit)}
                    className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-32 p-8 rounded-3xl border border-white/10 bg-card/50 backdrop-blur-xl">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Weight</span>
                    <span className="font-medium">{getCartTotalKG().toLocaleString()} KG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{getCartTotal().toLocaleString("en-IN")}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-lg font-bold">Estimated Total</span>
                    <span className="text-2xl font-bold text-primary">₹{getCartTotal().toLocaleString("en-IN")}</span>
                  </div>
                </div>
                {getCartTotalKG() >= 100 ? (
                  <div className="space-y-3">
                    <div className="text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded text-center border border-yellow-500/20">
                      Bulk order detected (≥100 KG). Proceed to request a custom quote.
                    </div>
                    <Link href="/checkout">
                      <Button className="w-full h-14 text-lg rounded-full" size="lg">
                        Request Quote <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link href="/checkout">
                    <Button className="w-full h-14 text-lg rounded-full" size="lg">
                      Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
    </ProtectedRoute>
  );
}
