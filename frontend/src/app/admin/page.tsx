"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, IndianRupee, Package, ShoppingCart, Users, Activity, Clock, ShieldAlert, Cpu, Download, Server, HardDrive, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function AdminOverview() {
  const { data: realStats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axios.get("/api/stats");
      return res.data;
    },
    refetchInterval: 30000 // Refetch every 30s for live server stats
  });

  const exportCSV = () => {
    if (!realStats) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Revenue,${realStats.revenue}\n`
      + `Active Orders,${realStats.activeOrders}\n`
      + `Total Products,${realStats.totalProducts}\n`
      + `Total Users,${realStats.totalUsers}\n`
      + `Pending KYC,${realStats.pendingKyc}\n`
      + `Unread Enquiries,${realStats.newEnquiries}\n`
      + `Avg Transit Time (Days),${realStats.avgTransitTime}\n`
      + `Server Uptime (Hrs),${(realStats.serverStats.uptime / 3600).toFixed(2)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const primaryStats = [
    { title: "Total Revenue", value: isLoading ? "..." : `₹${realStats?.revenue?.toLocaleString("en-IN") || 0}`, icon: IndianRupee },
    { title: "Active Orders", value: isLoading ? "..." : `${realStats?.activeOrders || 0}`, icon: ShoppingCart },
    { title: "Total Products", value: isLoading ? "..." : `${realStats?.totalProducts || 0}`, icon: Package },
    { title: "Total Customers", value: isLoading ? "..." : `${realStats?.totalUsers || 0}`, icon: Users },
  ];

  const operationalStats = [
    { title: "KYC Backlog", value: isLoading ? "..." : `${realStats?.pendingKyc || 0}`, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Unread Enquiries", value: isLoading ? "..." : `${realStats?.newEnquiries || 0}`, icon: Activity, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { title: "Avg Transit Time", value: isLoading ? "..." : `${realStats?.avgTransitTime || 0} Days`, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "System Health", value: isLoading ? "..." : (realStats?.serverStats.loadAvg[0] > 1 ? "Stressed" : "Optimal"), icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  const serverMetrics = [
    { title: "Server Uptime", value: isLoading ? "..." : `${(realStats?.serverStats.uptime / 3600).toFixed(1)} Hrs`, icon: Server },
    { title: "Heap Memory Used", value: isLoading ? "..." : `${(realStats?.serverStats.heapUsed / 1024 / 1024).toFixed(2)} MB`, icon: HardDrive },
    { title: "Load Average (1m)", value: isLoading ? "..." : `${realStats?.serverStats.loadAvg[0]?.toFixed(2)}`, icon: Activity },
    { title: "Top Varieties Tracked", value: isLoading ? "..." : `${realStats?.topVarieties?.length || 0}`, icon: BarChart3 },
  ];

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time B2B metrics, system health, and logistics.</p>
        </div>
        <Button onClick={exportCSV} disabled={isLoading} className="rounded-full gap-2 px-6 h-12 shadow-lg hover:shadow-primary/20 transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </motion.div>

      {/* Primary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card border-white/5 hover:border-white/20 transition-all shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">{stat.value}</div></CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Operational Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operationalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (index * 0.1) }}>
              <Card className="bg-secondary/20 border-white/5 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent><div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div></CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Server Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Varieties Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card className="bg-card border-white/5 pt-6 pb-2 px-6 h-full">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Top Performing Varieties</h3>
              <p className="text-sm text-muted-foreground">Product catalog distribution by category.</p>
            </div>
            <div className="h-[300px] w-full">
              {!isLoading && realStats?.topVarieties && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={realStats.topVarieties}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="_id" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Server Metrics Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-1 space-y-4">
          <div className="bg-card border border-white/5 rounded-2xl p-6 h-full shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Server className="w-5 h-5 text-primary" /> Live Server Metrics</h3>
            <div className="space-y-6">
              {serverMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <metric.icon className="w-4 h-4" />
                    <span className="text-sm">{metric.title}</span>
                  </div>
                  <span className="font-mono font-medium">{metric.value}</span>
                </div>
              ))}
              <div className="pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>API Load Capacity</span>
                  <span>Optimal</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
