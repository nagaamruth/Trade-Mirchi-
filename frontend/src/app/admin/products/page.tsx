"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Edit, Trash2, Download, BarChart2, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

interface Product {
  _id: string;
  name: string;
  category: string;
  currentPrice: number;
  stock: number;
  status: string;
}

export default function AdminProductsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [analyticsProduct, setAnalyticsProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axios.get("/api/products?admin=true");
      return res.data.products;
    }
  });

  const displayProducts = data || [];

  const exportToCSV = () => {
    if (!displayProducts.length) return;
    const headers = ["ID,Name,Category,Price,Stock,Status"];
    const rows = displayProducts.map((p: Product) => `"${p._id}","${p.name}","${p.category}",${p.currentPrice},${p.stock},"${p.status}"`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${id}`);
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="space-y-8">
      <AddProductModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-products"] })} 
      />
      <EditProductModal 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-products"] })} 
        product={editingProduct}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your catalog, pricing, and inventory.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
          <Button variant="outline" className="rounded-full shadow-sm" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button className="rounded-full shadow-lg" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </motion.div>
      </div>

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
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading products...</td></tr>
              ) : displayProducts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No products found.</td></tr>
              ) : (
                displayProducts.map((product: Product) => (
                  <tr key={product._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4">₹{product.currentPrice.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 100 ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 text-muted-foreground">
                        <button onClick={() => setAnalyticsProduct(product)} className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><BarChart2 className="w-4 h-4" /></button>
                        <button onClick={() => setEditingProduct(product)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {analyticsProduct && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{analyticsProduct.name} Analytics</h2>
              <button onClick={() => setAnalyticsProduct(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
               <div className="bg-secondary/30 p-4 rounded-xl border border-white/5">
                 <p className="text-sm text-muted-foreground">Total Views</p>
                 <p className="text-2xl font-bold mt-1">1,420</p>
               </div>
               <div className="bg-secondary/30 p-4 rounded-xl border border-white/5">
                 <p className="text-sm text-muted-foreground">Units Sold</p>
                 <p className="text-2xl font-bold mt-1">345</p>
               </div>
               <div className="bg-secondary/30 p-4 rounded-xl border border-white/5">
                 <p className="text-sm text-muted-foreground">Revenue Generated</p>
                 <p className="text-2xl font-bold mt-1 text-emerald-500">₹{(345 * analyticsProduct.currentPrice).toLocaleString("en-IN")}</p>
               </div>
               <div className="bg-secondary/30 p-4 rounded-xl border border-white/5">
                 <p className="text-sm text-muted-foreground">Conversion Rate</p>
                 <p className="text-2xl font-bold mt-1">24.3%</p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
