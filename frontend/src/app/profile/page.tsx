"use client";

import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, Package, Settings, Camera, MapPin, Loader2, Phone, FileText, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const { user, setUser, token, logout } = useStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("orders");
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

  const [kycData, setKycData] = useState({
    type: "Business License",
    number: "",
    url: ""
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
    if (user && token) {
      // Fetch fresh user data on mount to ensure KYC status is up-to-date
      axios.get(`/api/users/profile?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.user) {
          setUser(res.data.user, token);
          setFormData({
            name: res.data.user.name || "",
            email: res.data.user.email || "",
            phone: res.data.user.phone || "",
            password: "",
            photo: res.data.user.photo || "",
          });
        }
      }).catch(err => console.error("Failed to fetch fresh user data", err));

      // Fetch user orders
      axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setOrders(res.data.orders || []);
      }).catch(err => console.error("Failed to fetch orders", err));
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
      alert("Profile updated successfully");
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

  const handleKycUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await axios.post("/api/upload", data);
      setKycData({ ...kycData, url: res.data.url });
    } catch (error) {
      alert("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycData.url) {
      alert("Please upload a document image");
      return;
    }
    setLoading(true);
    try {
      const updatedDocs = [...(user?.kycDocuments || []), kycData];
      const res = await axios.put("/api/users/profile", { 
        kycStatus: "pending", 
        kycDocuments: updatedDocs 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user, token);
      alert("KYC documents submitted successfully");
      setKycData({ type: "Business License", number: "", url: "" });
    } catch (error) {
      alert("Failed to submit KYC");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">My Profile</h1>
            <p className="text-xl text-muted-foreground font-light">Manage your account settings, addresses, and orders.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar / User Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1 space-y-6">
              <div className="bg-card border border-white/5 rounded-3xl p-6 text-center shadow-lg">
                <div className="relative w-24 h-24 mx-auto mb-6 group">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-3xl">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Camera className="w-6 h-6 text-white" />}
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
                  </label>
                </div>
                
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-foreground capitalize mb-8">
                  {user.role} Account
                </div>
                
                <nav className="flex flex-col gap-2 text-left w-full mb-8">
                  <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === "orders" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}>
                    <Package className="w-4 h-4" /> Orders
                  </button>
                  <button onClick={() => setActiveTab("settings")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === "settings" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}>
                    <Settings className="w-4 h-4" /> Account Settings
                  </button>
                  <button onClick={() => setActiveTab("addresses")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === "addresses" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}>
                    <MapPin className="w-4 h-4" /> Saved Addresses
                  </button>
                  <button onClick={() => setActiveTab("kyc")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === "kyc" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"}`}>
                    <FileText className="w-4 h-4" /> KYC Verification
                  </button>
                </nav>

                <Button onClick={handleLogout} variant="outline" className="w-full rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-3">
              <div className="bg-card border border-white/5 rounded-3xl p-8 shadow-lg min-h-[500px]">
                
                {activeTab === "orders" && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Recent Orders</h3>
                    {orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-secondary/5">
                        <Package className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                        <Button variant="link" className="text-primary mt-2" onClick={() => router.push("/products")}>
                          Browse Marketplace
                        </Button>
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

                {activeTab === "settings" && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
                          </div>
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
                          </div>
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">New Password (leave blank to keep current)</label>
                          <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" placeholder="••••••••" />
                        </div>
                      </div>
                      <Button type="submit" disabled={loading} className="rounded-xl">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                    </form>
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
                            <select value={address.label} onChange={e => setAddress({...address, label: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                              <option value="Home">Home</option>
                              <option value="Office">Office</option>
                              <option value="Warehouse">Warehouse</option>
                            </select>
                          </div>
                          <div className="space-y-2 col-span-2">
                            <label className="text-xs font-medium text-muted-foreground">Street Address</label>
                            <input required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">City</label>
                            <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">State</label>
                            <input required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">ZIP Code</label>
                            <input required value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                          </div>
                        </div>
                        <Button type="submit" disabled={loading} variant="secondary" className="rounded-xl mt-2">
                          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Save Address
                        </Button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === "kyc" && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">KYC Verification</h3>
                    <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col sm:flex-row items-center gap-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                        user.kycStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-500' :
                        user.kycStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        user.kycStatus === 'rejected' ? 'bg-rose-500/20 text-rose-500' :
                        'bg-white/10 text-muted-foreground'
                      }`}>
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">Verification Status: <span className="capitalize">{user.kycStatus || 'Unverified'}</span></h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {user.kycStatus === 'approved' ? 'Your account is fully verified.' :
                           user.kycStatus === 'pending' ? 'Your documents are under review by our admin team.' :
                           user.kycStatus === 'rejected' ? 'Your KYC was rejected. Please submit valid documents.' :
                           'Please submit your business documents to verify your account.'}
                        </p>
                      </div>
                    </div>

                    {user.kycStatus === 'approved' && (
                      <div className="mb-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-emerald-500 flex items-center gap-2 mb-4">
                          <ShieldCheck className="w-5 h-5" />
                          Verified B2B Member Benefits
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-emerald-500 font-bold text-xs">✓</span>
                            </div>
                            <p className="text-sm text-emerald-100/90"><strong className="text-emerald-400">Bulk Ordering Access:</strong> Unrestricted access to purchase wholesale quantities (Quintals and Tons) across all categories.</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-emerald-500 font-bold text-xs">✓</span>
                            </div>
                            <p className="text-sm text-emerald-100/90"><strong className="text-emerald-400">Priority Logistics:</strong> Expedited shipping and dedicated logistics support for large-scale agricultural shipments.</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-emerald-500 font-bold text-xs">✓</span>
                            </div>
                            <p className="text-sm text-emerald-100/90"><strong className="text-emerald-400">Wholesale Pricing:</strong> Exclusive access to dynamic B2B tiered pricing and special promotional discounts.</p>
                          </li>
                        </ul>
                      </div>
                    )}

                    {(user.kycStatus === 'approved' || user.kycStatus === 'pending') && user.kycDocuments && user.kycDocuments.length > 0 && (
                      <div className="mb-8 bg-secondary/10 p-6 rounded-2xl border border-white/5 space-y-4">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5" /> Submitted Documents
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {user.kycDocuments.map((doc: any, i: number) => (
                            <div key={i} className="flex gap-4 items-center bg-background border border-white/5 p-3 rounded-xl">
                              {doc.url ? (
                                <a href={doc.url} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 overflow-hidden rounded-lg bg-black hover:opacity-80 transition-opacity">
                                  <img src={doc.url} alt={doc.type} className="w-full h-full object-cover" />
                                </a>
                              ) : (
                                <div className="w-16 h-16 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-xs">No Image</div>
                              )}
                              <div>
                                <p className="font-bold text-sm text-foreground">{doc.type}</p>
                                <p className="text-xs text-muted-foreground font-mono mt-1">{doc.number}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {user.kycStatus === 'pending' && (
                          <div className="pt-4 mt-2 border-t border-white/5">
                            <Button 
                              onClick={() => setUser({ ...user, kycStatus: 'unverified' }, token)} 
                              variant="outline" 
                              className="text-sm border-primary/20 text-primary hover:bg-primary/10"
                            >
                              Submit Another Request
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {user.kycStatus !== 'approved' && user.kycStatus !== 'pending' && (
                      <form onSubmit={handleSubmitKyc} className="space-y-6 max-w-xl">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Document Type</label>
                          <select required value={kycData.type} onChange={e => setKycData({...kycData, type: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary">
                            <option value="Business License">Business License</option>
                            <option value="GST">GST Certificate</option>
                            <option value="Aadhar">Aadhar Card</option>
                            <option value="PAN">PAN Card</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Document Number</label>
                          <input required value={kycData.number} onChange={e => setKycData({...kycData, number: e.target.value})} placeholder="e.g. GSTIN1234..." className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Upload Document Image</label>
                          <div className="flex items-center gap-4">
                            {kycData.url && (
                              <img src={kycData.url} alt="Document" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                            )}
                            <label className="flex items-center justify-center px-4 py-2 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                              {uploading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Camera className="w-5 h-5 text-muted-foreground mr-2" />}
                              <span className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Choose File'}</span>
                              <input type="file" className="hidden" accept="image/*" onChange={handleKycUpload} disabled={uploading} />
                            </label>
                          </div>
                        </div>
                        <Button type="submit" disabled={loading || uploading} className="rounded-xl w-full h-12">
                          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Submit for Verification
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
