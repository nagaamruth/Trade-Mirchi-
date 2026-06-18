"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, MapPin, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onUpdateOrder: (id: string, updates: any) => Promise<void>;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function OrderDetailsModal({ isOpen, onClose, order, onUpdateOrder }: OrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  if (!isOpen || !order) return null;

  const handleUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true);
    await onUpdateOrder(order._id, { status: e.target.value });
    setIsUpdating(false);
  };

  const handlePaymentUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdatingPayment(true);
    await onUpdateOrder(order._id, { paymentStatus: e.target.value });
    setIsUpdatingPayment(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-sm text-muted-foreground">ID: {order._id}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            
            {/* Status & Payment */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/20 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Package className="w-4 h-4" /> Status
                  {isUpdating && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                </div>
                <select 
                  value={order.status} 
                  onChange={handleUpdate}
                  disabled={isUpdating}
                  className={`w-full mt-1 px-3 py-2 rounded-lg text-sm font-bold bg-background border focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${statusStyles[order.status] || ''}`}
                >
                  <option value="pending" className="bg-background text-foreground">Pending</option>
                  <option value="processing" className="bg-background text-foreground">Processing</option>
                  <option value="shipped" className="bg-background text-foreground">Shipped</option>
                  <option value="delivered" className="bg-background text-foreground">Delivered</option>
                  <option value="cancelled" className="bg-background text-foreground">Cancelled</option>
                </select>
              </div>
              <div className="bg-secondary/20 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <CreditCard className="w-4 h-4" /> Payment Status
                  {isUpdatingPayment && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                </div>
                <select 
                  value={order.paymentStatus || 'pending'} 
                  onChange={handlePaymentUpdate}
                  disabled={isUpdatingPayment}
                  className={`w-full mt-1 px-3 py-2 rounded-lg text-sm font-bold bg-background border focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
                    order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    order.paymentStatus === 'failed' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}
                >
                  <option value="pending" className="bg-background text-foreground">Pending</option>
                  <option value="paid" className="bg-background text-foreground">Paid</option>
                  <option value="failed" className="bg-background text-foreground">Failed</option>
                </select>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Items Ordered</h3>
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-secondary/10 p-3 rounded-lg border border-white/5">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 border-t border-white/10 mt-2">
                  <p className="font-bold text-lg">Total Amount</p>
                  <p className="font-bold text-xl text-primary">₹{order.totalAmount?.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            {order.shippingAddress && (
              <div>
                <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Shipping Information</h3>
                <div className="flex items-start gap-3 bg-secondary/10 p-4 rounded-xl border border-white/5">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{order.shippingAddress.label || 'Home'}</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress.street}</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
