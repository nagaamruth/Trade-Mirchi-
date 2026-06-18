"use client";

import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Mail, Package, Settings, Camera, MapPin, Loader2, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminProfilePage() {
  const { user, setUser, token } = useStore();

  const [activeTab, setActiveTab] = useState("settings");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    photo: "",
  });

  const [address, setAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        photo: user.photo || "",
      });
      // Fetch user's own orders
      axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setOrders(res.data.orders || []);
      }).catch(err => console.error("Failed to fetch personal orders", err));
    }
  }, [user, token]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await axios.post("/api/upload", data);
      setFormData({ ...formData, photo: res.data.url });
    } catch (error) {
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user, token);
      alert("Admin profile updated successfully");
      setFormData({...formData, password: ""});
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedAddresses = [...(user?.addresses || []), address];
      const res = await axios.put("/api/users/profile", { addresses: updatedAddresses }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user, token);
      setAddress({ label: "Home", street: "", city: "", state: "", zipCode: "" });
      alert("Address saved successfully");
    } catch (error) {
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal credentials, addresses, and activity.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar / User Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 space-y-6">
          <div className="bg-card border border-white/5 rounded-3xl p-6 text-center shadow-lg">
            <div className="relative w-24 h-24 mx-auto mb-6 group">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-primary/20" />
              ) : (
                <div className="w-full h-full rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Camera className="w-6 h-6 text-white" />}
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize mb-8">
              {user.role}
            </div>
            
            <nav className="flex flex-col gap-2 text-left w-full mb-2">
              <button onClick={() => setActiveTab("settings")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === "settings" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}>
                <Settings className="w-4 h-4" /> Account Settings
              </button>
              <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === "orders" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}>
                <Package className="w-4 h-4" /> Personal Orders
              </button>
              <button onClick={() => setActiveTab("addresses")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === "addresses" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}>
                <MapPin className="w-4 h-4" /> Saved Addresses
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-3">
          <div className="bg-card border border-white/5 rounded-3xl p-8 shadow-lg min-h-[500px]">
            
            {activeTab === "settings" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Edit Admin Credentials</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">New Password (leave blank to keep current)</label>
                      <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" placeholder="••••••••" />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="rounded-xl px-8">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Personal Order History</h3>
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-secondary/5">
                    <Package className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground">You haven't placed any personal orders.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order._id} className="border border-white/10 rounded-xl p-4 bg-secondary/5 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <p className="font-bold text-sm text-muted-foreground mb-1">Order ID: {order._id}</p>
                          <div className="text-lg font-bold">₹{order.totalAmount?.toLocaleString("en-IN")}</div>
                          <div className="text-sm mt-2">
                            {order.items?.map((item: any) => (
                              <div key={item._id || item.product} className="text-muted-foreground">
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 
                            order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Saved Addresses</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-white/10 bg-secondary/10 relative">
                        <span className="absolute top-4 right-4 text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded-full">{addr.label}</span>
                        <MapPin className="w-5 h-5 text-muted-foreground mb-3" />
                        <p className="text-sm">{addr.street}</p>
                        <p className="text-sm">{addr.city}, {addr.state} {addr.zipCode}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-2">No addresses saved yet.</p>
                  )}
                </div>

                <div className="pt-8 border-t border-white/10">
                  <h4 className="font-semibold mb-4 text-lg">Add New Address</h4>
                  <form onSubmit={handleAddAddress} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-xs font-medium text-muted-foreground">Label</label>
                        <select value={address.label} onChange={e => setAddress({...address, label: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Warehouse">Warehouse</option>
                        </select>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-medium text-muted-foreground">Street Address</label>
                        <input required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">City</label>
                        <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">State</label>
                        <input required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">ZIP Code</label>
                        <input required value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <Button type="submit" disabled={loading} variant="secondary" className="rounded-xl mt-2 px-8 border border-white/5">
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save Address
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
