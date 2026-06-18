"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductCard, Product } from "@/components/ProductCard";
import { motion } from "framer-motion";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get("/api/products");
  return data.products;
};

function ProductsContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const displayProducts = data && data.length > 0 ? data : [];
  
  const filteredProducts = displayProducts.filter((p: Product) => 
    p.name.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query)
  );

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light">
            Discover premium, certified agricultural commodities directly from verified suppliers.
          </p>
          {query && (
            <p className="mt-4 text-emerald-500 font-medium">
              Showing search results for: "{query}"
            </p>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[400px] rounded-xl bg-secondary/20 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
            Failed to load products. Please check your connection.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 rounded-xl bg-secondary/10 text-muted-foreground border border-white/5 text-center">
            No products found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product: Product, index: number) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-32 text-center text-muted-foreground">Loading marketplace...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
