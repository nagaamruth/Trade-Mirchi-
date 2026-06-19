"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    category: "Red Chilli",
    description: "",
    stock: 0,
    moq: 1,
    origin: "",
    grade: "",
    packaging: "",
    currentPrice: 0,
    status: "active"
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await axios.post("/api/upload", data);
      setImageUrl(res.data.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/products", {
        ...formData,
        images: imageUrl ? [imageUrl] : ["https://res.cloudinary.com/ddkbtk9xf/image/upload/v1717326084/samples/food/spices.jpg"]
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add product", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-secondary/30">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" placeholder="e.g. Premium Teja Red Chilli" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Variety</label>
                  <input required value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" placeholder="e.g. Teja, Sannam" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary">
                    <option value="Red Chilli">Red Chilli</option>
                    <option value="Turmeric">Turmeric</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <input type="number" required value={formData.currentPrice} onChange={e => setFormData({...formData, currentPrice: Number(e.target.value)})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Origin</label>
                  <input required value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" placeholder="e.g. Guntur" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade</label>
                  <input required value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" placeholder="e.g. Premium" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Packaging</label>
                  <input required value={formData.packaging} onChange={e => setFormData({...formData, packaging: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" placeholder="e.g. Jute Bag" />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Product Image</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center relative hover:border-primary/50 transition-colors">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Uploaded" className="h-32 object-contain mb-4" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    )}
                    <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Click to upload image"}</span>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary h-24" placeholder="Product description..." />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={loading || uploading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Product
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
