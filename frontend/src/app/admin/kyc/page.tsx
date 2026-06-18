"use client";

import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ShieldCheck, FileText, CheckCircle, XCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";

export default function AdminKycPage() {
  const { token } = useStore();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-kyc-users"],
    queryFn: async () => {
      const res = await axios.get(`/api/users?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter users who have submitted KYC
      return res.data.users.filter((u: any) => u.kycStatus === "pending" || u.kycStatus === "rejected" || u.kycStatus === "approved");
    }
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`/api/users/${id}`, { kycStatus: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      queryClient.invalidateQueries({ queryKey: ["admin-kyc-users"] });
      alert(`KYC status updated to ${newStatus}`);
    } catch (error) {
      alert("Failed to update KYC status");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">KYC Verification Queue</h1>
        <p className="text-muted-foreground mt-1">Review business documents and approve B2B accounts.</p>
      </motion.div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading queue...</div>
        ) : users?.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-secondary/5">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No KYC applications in the queue.</p>
          </div>
        ) : (
          users?.map((user: any, idx: number) => (
            <motion.div 
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start shadow-sm"
            >
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      user.kycStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      user.kycStatus === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {user.kycStatus}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email} • {user.phone || 'No phone'}</p>
                </div>
                
                <div className="bg-secondary/10 p-4 rounded-xl border border-white/5 space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Submitted Documents
                  </h4>
                  {user.kycDocuments?.map((doc: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="w-24 h-16 shrink-0 overflow-hidden rounded bg-black border border-white/10 hover:opacity-80 transition-opacity relative group block">
                          <img src={doc.url} alt={doc.type} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold">VIEW</span>
                          </div>
                        </a>
                      ) : (
                        <div className="w-24 h-16 shrink-0 rounded bg-secondary flex items-center justify-center text-xs">No Image</div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-foreground">{doc.type}</p>
                        <p className="text-xs text-muted-foreground font-mono">{doc.number}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                <Button 
                  onClick={() => handleUpdateStatus(user._id, "approved")}
                  disabled={user.kycStatus === "approved"}
                  className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus(user._id, "rejected")}
                  disabled={user.kycStatus === "rejected"}
                  variant="outline"
                  className="border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
