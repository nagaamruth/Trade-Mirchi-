"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";

export default function AnnouncementBar() {
  const { user } = useStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  if (!mounted || user) return null;

  return (
    <div className="w-full bg-primary text-primary-foreground py-2.5 px-4 text-xs sm:text-sm font-medium relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 hidden sm:block" />
        <p>
          Welcome to the future of agricultural trading. 
          <span className="hidden sm:inline"> Join thousands of farmers and buyers worldwide.</span>
        </p>
        <motion.a
          href="/register"
          className="inline-flex items-center underline underline-offset-4 hover:text-white transition-colors"
          whileHover={{ x: 2 }}
        >
          Get Started <ArrowRight className="ml-1 w-3 h-3" />
        </motion.a>
      </div>
    </div>
  );
}
