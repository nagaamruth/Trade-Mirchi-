import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Enquiry from "@/models/Enquiry";
import os from "os";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const [orders, totalProducts, totalUsers, pendingKyc, newEnquiries, topVarieties, memory] = await Promise.all([
      Order.find({}),
      Product.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ kycStatus: "pending" }),
      Enquiry.countDocuments({ status: "new" }),
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 4 }
      ]),
      process.memoryUsage()
    ]);

    const activeOrders = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled").length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    // Average transit time (Deliveries)
    const deliveredOrders = orders.filter(o => o.status === "delivered");
    let avgTransitTime = 0;
    if (deliveredOrders.length > 0) {
      const totalTime = deliveredOrders.reduce((sum, o) => sum + (new Date(o.updatedAt).getTime() - new Date(o.createdAt).getTime()), 0);
      avgTransitTime = totalTime / deliveredOrders.length / (1000 * 60 * 60 * 24); // in days
    }

    return NextResponse.json({
      revenue: totalRevenue,
      activeOrders,
      totalProducts,
      totalUsers,
      pendingKyc,
      newEnquiries,
      topVarieties,
      avgTransitTime: Number(avgTransitTime.toFixed(1)),
      serverStats: {
        uptime: os.uptime(),
        freeMem: os.freemem(),
        totalMem: os.totalmem(),
        loadAvg: os.loadavg(),
        heapUsed: memory.heapUsed
      }
    });

  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
