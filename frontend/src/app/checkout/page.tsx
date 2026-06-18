"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
// Helper duplicated here or we should export it from useStore. Since it's internal to store right now, let's just do it directly.
const getMultiplier = (unit: string) => {
  switch (unit) {
    case "Grams": return 0.001;
    case "Quintal": return 100;
    case "Ton": return 1000;
    case "KG":
    default: return 1;
  }
};
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CheckoutPage() {
  const { cart, getCartTotal, getCartTotalKG, clearCart, user, token } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  useEffect(() => {
    if (!user?.addresses || user.addresses.length === 0) {
      setUseNewAddress(true);
    }
  }, [user]);

  const total = getCartTotal();

  const isBulk = getCartTotalKG() >= 100;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      let finalAddress = useNewAddress ? newAddress : user?.addresses?.[selectedAddressIndex];

      if (!finalAddress || (!useNewAddress && (!user?.addresses || user.addresses.length === 0))) {
        alert("Please provide a shipping address / contact location.");
        setIsProcessing(false);
        return;
      }

      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.cartQuantity,
          unit: item.unit,
          price: item.currentPrice
        })),
        totalAmount: total,
        paymentMethod: isBulk ? "Quote Request" : "Razorpay/Card",
        shippingAddress: {
          street: finalAddress.street,
          city: finalAddress.city,
          state: finalAddress.state,
          zipCode: finalAddress.zipCode,
          country: finalAddress.country || "India"
        }
      };

      // In a real app, isBulk would call /api/enquiries instead of /api/orders
      // For now, we reuse the Orders endpoint but mark it as an offline B2B order/enquiry
      await axios.post("/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <ProtectedRoute>
      <main className="min-h-screen bg-background flex items-center justify-center p-6 pt-24">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-card text-center"
        >
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">{isBulk ? "Quote Request Sent!" : "Payment Successful!"}</h1>
          <p className="text-muted-foreground mb-8">
            {isBulk 
              ? "Your enquiry has been securely transmitted to the Adathi. Our team will review the availability and contact you shortly with a custom quote."
              : "Your order has been placed and is being processed. You will receive an email confirmation shortly."}
          </p>
          <Link href="/profile">
            <Button className="w-full h-12 rounded-full">View My Orders</Button>
          </Link>
        </motion.div>
      </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold mb-8">Checkout Details</h1>
          
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Contact Information</h2>
              <input type="email" value={user?.email || ""} disabled className="w-full bg-secondary/20 border border-white/10 rounded-xl px-4 py-3 text-muted-foreground focus:outline-none" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Shipping Address</h2>
                {user?.addresses && user.addresses.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setUseNewAddress(!useNewAddress)}
                    className="text-sm text-primary hover:underline"
                  >
                    {useNewAddress ? "Use Saved Address" : "Add New Address"}
                  </button>
                )}
              </div>

              {!useNewAddress && user?.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((addr: any, idx: number) => (
                    <label 
                      key={idx} 
                      className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddressIndex === idx ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'}`}
                    >
                      <input 
                        type="radio" 
                        name="savedAddress" 
                        checked={selectedAddressIndex === idx} 
                        onChange={() => setSelectedAddressIndex(idx)} 
                        className="mt-1"
                      />
                      <div>
                        <p className="font-bold text-sm bg-secondary px-2 py-0.5 rounded inline-block mb-1">{addr.label}</p>
                        <p className="text-sm">{addr.street}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 bg-secondary/10 p-4 rounded-xl border border-white/10">
                  <input type="text" placeholder="Street Address" required={useNewAddress} value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="City" required={useNewAddress} value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
                    <input type="text" placeholder="State" required={useNewAddress} value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
                  </div>
                  <input type="text" placeholder="PIN Code" required={useNewAddress} value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
                </div>
              )}
            </div>

            <Button type="submit" disabled={isProcessing || cart.length === 0} className="w-full h-14 text-lg rounded-full mt-8">
              {isProcessing ? "Processing..." : isBulk ? "Submit Quote Request" : `Pay ₹${total.toLocaleString("en-IN")}`}
            </Button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:pl-8">
          <div className="sticky top-24 p-8 rounded-3xl border border-white/10 bg-card/30 backdrop-blur-md">
            <h2 className="text-xl font-medium mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={`${item._id}-${item.unit}`} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg bg-secondary shrink-0 overflow-hidden relative">
                    <img src={item.images?.[0] || "https://images.unsplash.com/photo-1596649282717-54c34a17ed9f?w=800"} className="w-full h-full object-cover" alt={item.name} />
                    <div className="absolute -top-2 -right-2 w-auto min-w-[1.25rem] px-1 h-5 bg-primary text-background rounded-full flex items-center justify-center text-[10px] font-bold">
                      {item.cartQuantity} {item.unit}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate max-w-[150px]">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.currentPrice.toLocaleString("en-IN")}/KG</p>
                  </div>
                  <div className="font-medium shrink-0 text-right">
                    ₹{(item.currentPrice * getMultiplier(item.unit) * item.cartQuantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary text-2xl">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
    </ProtectedRoute>
  );
}
