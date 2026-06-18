"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Mail, ShieldCheck, Edit, X, Save } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  phone?: string;
  photo?: string;
  kycStatus?: string;
}

export default function AdminCustomersPage() {
  const { token } = useStore();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", password: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axios.get(`/api/users?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.users;
    }
  });

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await axios.put(`/api/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (error) {
      alert("Failed to update user role");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await axios.put(`/api/users/${editingUser._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setEditingUser(null);
      alert("User updated successfully");
    } catch (error) {
      alert("Failed to update user");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Customers & Users</h1>
        <p className="text-muted-foreground mt-1">Manage platform accounts, roles, and verifications.</p>
      </motion.div>

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
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">KYC Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading users...</td></tr>
              ) : (
                data?.map((user: User) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {user.email}
                      </div>
                      {user.phone && <div className="text-xs mt-1">{user.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.kycStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        user.kycStatus === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                        user.kycStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-white/10 text-muted-foreground'
                      }`}>
                        {user.kycStatus || 'unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold bg-transparent border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'}`}
                      >
                        <option value="customer" className="bg-background text-foreground">Customer</option>
                        <option value="admin" className="bg-background text-foreground">Admin</option>
                        <option value="superadmin" className="bg-background text-foreground">Superadmin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setEditingUser(user);
                          setEditForm({ name: user.name, email: user.email, phone: user.phone || "", password: "" });
                        }}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 hover:bg-secondary rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Edit className="w-5 h-5" /> Edit Customer
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Full Name</label>
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Email</label>
                  <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Phone</label>
                  <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground text-rose-400">Force New Password (Optional)</label>
                  <input type="password" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} placeholder="Leave blank to keep current" className="w-full bg-background border border-rose-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500" />
                </div>
                
                <Button onClick={handleSaveEdit} className="w-full mt-4">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}