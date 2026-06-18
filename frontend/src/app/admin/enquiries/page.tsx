"use client";

import { motion } from "framer-motion";

export default function AdminEnquiriesPage() {
  // Static placeholder for Enquiries Dashboard until API is built
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">B2B Enquiries</h1>
          <p className="text-muted-foreground mt-1">Manage wholesale quote requests and follow-ups.</p>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-xl font-medium mb-2">No Enquiries Yet</h3>
          <p className="text-muted-foreground max-w-md">
            When buyers request a quote for bulk orders (≥100 KG), they will appear here for you to review and follow up.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
