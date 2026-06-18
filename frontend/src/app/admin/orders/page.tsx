"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  processing: "bg-blue-500/10 text-blue-500",
  shipped: "bg-purple-500/10 text-purple-500",
  delivered: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-rose-500/10 text-rose-500",
};

export default function AdminOrdersPage() {
  const { token } = useStore();
  const queryClient = useQueryClient();
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await axios.get("/api/orders?admin=true", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.orders;
    }
  });

  const handleOrderUpdate = async (id: string, updates: any) => {
    try {
      await axios.put(`/api/orders/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (error) {
      alert("Failed to update order");
    }
  };

  return (
    <div className="space-y-8">
      <OrderDetailsModal 
        isOpen={!!viewingOrder} 
        onClose={() => setViewingOrder(null)} 
        order={viewingOrder}
        onUpdateOrder={handleOrderUpdate} 
      />

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and process customer orders.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-secondary/30 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading orders...</td></tr>
              ) : !orders || orders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No orders found.</td></tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 font-medium">₹{order.totalAmount?.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status} 
                        onChange={(e) => handleOrderUpdate(order._id, { status: e.target.value })}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold bg-transparent border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary ${statusStyles[order.status]}`}
                      >
                        <option value="pending" className="bg-background text-foreground">Pending</option>
                        <option value="processing" className="bg-background text-foreground">Processing</option>
                        <option value="shipped" className="bg-background text-foreground">Shipped</option>
                        <option value="delivered" className="bg-background text-foreground">Delivered</option>
                        <option value="cancelled" className="bg-background text-foreground">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setViewingOrder(order)} className="p-2 text-muted-foreground hover:bg-white/10 rounded-lg transition-colors inline-flex items-center">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
