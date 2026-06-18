"use client";

import { motion } from "framer-motion";
import { Save, Shield, Bell, CreditCard, Mail, Globe, Database, Smartphone, Zap, TrendingUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SETTINGS_SECTIONS = [
  {
    title: "General Preferences",
    icon: Globe,
    settings: [
      { id: "site_name", label: "Site Name", type: "text", value: "Trade Mirchi" },
      { id: "currency", label: "Default Currency", type: "select", options: ["INR (₹)", "USD ($)", "EUR (€)"] },
      { id: "language", label: "Default Language", type: "select", options: ["English", "Hindi", "Telugu"] },
    ]
  },
  {
    title: "Security & Authentication",
    icon: Shield,
    settings: [
      { id: "2fa", label: "Require 2FA for Admins", type: "toggle", checked: true },
      { id: "session_timeout", label: "Session Timeout (minutes)", type: "number", value: 60 },
      { id: "password_policy", label: "Strict Password Policy", type: "toggle", checked: true },
    ]
  },
  {
    title: "Notifications & Alerts",
    icon: Bell,
    settings: [
      { id: "email_alerts", label: "Order Confirmation Emails", type: "toggle", checked: true },
      { id: "sms_alerts", label: "SMS Alerts for Shipping", type: "toggle", checked: false },
      { id: "admin_notify", label: "Notify Admin on New User", type: "toggle", checked: true },
    ]
  },
  {
    title: "Payment Gateway",
    icon: CreditCard,
    settings: [
      { id: "razorpay_key", label: "Razorpay Public Key", type: "password", value: "rzp_test_xxxxxx" },
      { id: "stripe_key", label: "Stripe Secret Key", type: "password", value: "sk_test_xxxxxx" },
      { id: "tax_rate", label: "Default Tax Rate (%)", type: "number", value: 18 },
    ]
  },
  {
    title: "System & API",
    icon: Database,
    settings: [
      { id: "maintenance_mode", label: "Enable Maintenance Mode", type: "toggle", checked: false },
      { id: "api_rate_limit", label: "API Rate Limit (req/min)", type: "number", value: 100 },
      { id: "webhook_url", label: "Global Webhook URL", type: "text", value: "https://api.trademirchi.com/webhook" },
    ]
  }
];

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const { token } = useStore();
  const queryClient = useQueryClient();

  const [localSettings, setLocalSettings] = useState<any>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.settings;
    }
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (newSettings: any) => {
      return await axios.put("/api/admin/settings", newSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      alert("Settings saved successfully!");
    },
    onError: () => {
      alert("Failed to save settings");
    }
  });

  const handleSave = () => {
    if (localSettings) {
      mutation.mutate(localSettings);
    }
  };

  const handleToggle = (key: string) => {
    if (localSettings) {
      setLocalSettings({ ...localSettings, [key]: !localSettings[key] });
    }
  };

  const handleContactChange = (field: string, value: string) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      contactDetails: { ...(prev.contactDetails || {}), [field]: value }
    }));
  };

  const addLiveRate = () => {
    setLocalSettings((prev: any) => ({
      ...prev,
      liveRates: [...(prev.liveRates || []), { commodity: "", price: "" }]
    }));
  };

  const removeLiveRate = (index: number) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      liveRates: prev.liveRates.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateLiveRate = (index: number, field: string, value: string) => {
    setLocalSettings((prev: any) => {
      const newRates = [...prev.liveRates];
      newRates[index][field] = value;
      return { ...prev, liveRates: newRates };
    });
  };

  if (isLoading || !localSettings) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1">Manage global configuration and platform preferences.</p>
        </div>
        <Button onClick={handleSave} className="rounded-full gap-2 px-6 h-11">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Globe className="w-5 h-5" /></div>
            <h2 className="text-lg font-semibold">General Preferences</h2>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-medium text-muted-foreground">Site Name</label>
              <input type="text" value={localSettings.siteName || ""} onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})} className="bg-secondary/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary w-full sm:w-48"/>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-medium text-muted-foreground">Default Currency</label>
              <select value={localSettings.currency || "INR"} onChange={(e) => setLocalSettings({...localSettings, currency: e.target.value})} className="bg-secondary/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary w-full sm:w-48">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground">Allow Retail Units (Grams / KG)</label>
                <span className="text-xs text-muted-foreground">If disabled, forces all purchases to Quintal/Ton.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={localSettings.allowRetailUnits || false} onChange={() => handleToggle('allowRetailUnits')} />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Shield className="w-5 h-5" /></div>
            <h2 className="text-lg font-semibold">Security & Access</h2>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-medium text-muted-foreground">Require 2FA for Admins</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={localSettings.require2FA || false} onChange={() => handleToggle('require2FA')} />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-destructive">Enable Maintenance Mode</label>
                <span className="text-xs text-muted-foreground">Suspends public access to marketplace.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={localSettings.maintenanceMode || false} onChange={() => handleToggle('maintenanceMode')} />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-destructive"></div>
              </label>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><TrendingUp className="w-5 h-5" /></div>
              <h2 className="text-lg font-semibold">Live Market Rates</h2>
            </div>
            <Button size="sm" variant="outline" onClick={addLiveRate} className="gap-1 h-8 px-3 rounded-full"><Plus className="w-3.5 h-3.5"/> Add Rate</Button>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {(localSettings.liveRates || []).map((rate: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input type="text" placeholder="Commodity (e.g. Premium Teja)" value={rate.commodity} onChange={(e) => updateLiveRate(index, "commodity", e.target.value)} className="flex-1 bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                <input type="text" placeholder="Price (e.g. ₹22,500/q)" value={rate.price} onChange={(e) => updateLiveRate(index, "price", e.target.value)} className="flex-1 bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                <button onClick={() => removeLiveRate(index)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
            {(!localSettings.liveRates || localSettings.liveRates.length === 0) && (
              <p className="text-sm text-muted-foreground italic text-center py-4">No live rates configured. Add one above.</p>
            )}
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 flex justify-end">
            <Button size="sm" onClick={handleSave} className="gap-2 px-4 rounded-full shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" /> Save Rates
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Mail className="w-5 h-5" /></div>
            <h2 className="text-lg font-semibold">Contact & Office Details</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Support Email</label>
                <input type="email" value={localSettings.contactDetails?.email || ""} onChange={(e) => handleContactChange("email", e.target.value)} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <input type="text" value={localSettings.contactDetails?.phone || ""} onChange={(e) => handleContactChange("phone", e.target.value)} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">WhatsApp Number</label>
                <input type="text" value={localSettings.contactDetails?.whatsapp || ""} onChange={(e) => handleContactChange("whatsapp", e.target.value)} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Working Hours</label>
                <input type="text" value={localSettings.contactDetails?.workingHours || ""} onChange={(e) => handleContactChange("workingHours", e.target.value)} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Office Address</label>
              <textarea rows={2} value={localSettings.contactDetails?.address || ""} onChange={(e) => handleContactChange("address", e.target.value)} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 flex justify-end">
            <Button size="sm" onClick={handleSave} className="gap-2 px-4 rounded-full shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" /> Save Contact Info
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}