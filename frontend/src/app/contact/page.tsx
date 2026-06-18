"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["public-settings"],
    queryFn: async () => {
      const res = await axios.get("/api/settings");
      return res.data.settings;
    }
  });

  if (isLoading) {
    return (
      <main className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  const contact = settings?.contactDetails || {};

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Whether you're looking to buy premium commodities or partner with us, our team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center hover:bg-secondary/30 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-muted-foreground mb-4">Mon-Sat from 9am to 6pm.</p>
            <a href={`tel:${contact.phone}`} className="text-lg font-semibold hover:text-primary transition-colors">
              {contact.phone}
            </a>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center hover:bg-secondary/30 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-muted-foreground mb-4">We'll respond within 24 hours.</p>
            <a href={`mailto:${contact.email}`} className="text-lg font-semibold hover:text-blue-500 transition-colors">
              {contact.email}
            </a>
          </motion.div>

          {/* WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center hover:bg-secondary/30 transition-colors sm:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
            <p className="text-muted-foreground mb-4">Instant messaging support.</p>
            <a href={`https://wa.me/${contact.whatsapp?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:text-emerald-500 transition-colors">
              {contact.whatsapp}
            </a>
          </motion.div>

          {/* Location Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 hover:bg-secondary/30 transition-colors md:col-span-2 lg:col-span-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Head Office</h3>
              <p className="text-muted-foreground text-lg mb-4 max-w-2xl">
                {contact.address}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-primary font-medium">
                <Clock className="w-4 h-4" /> {contact.workingHours}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
