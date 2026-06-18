"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useStore } from "@/store/useStore";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: any;
}

export default function EditProductModal({ isOpen, onClose, onSuccess, product }: EditProductModalProps) {
  const { token } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    currentPrice: "",
    stock: "",
    status: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "Red Chilli",
        currentPrice: product.currentPrice?.toString() || "",
        stock: product.stock?.toString() || "",
        status: product.status || "active",
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`/api/products/${product._id}`, {
        ...formData,
        currentPrice: Number(formData.currentPrice),
        stock: Number(formData.stock),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
      onClose();
    } catch (error) {
      alert("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

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
            <h2 className="text-xl font-bold">Edit Product</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option value="Red Chilli">Red Chilli</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (₹ per quintal)</label>
                <input required type="number" value={formData.currentPrice} onChange={(e) => setFormData({...formData, currentPrice: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock (units)</label>
                <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
