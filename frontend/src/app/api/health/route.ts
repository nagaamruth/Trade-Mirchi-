import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const conn = await connectDB();
    return NextResponse.json(
      { 
        status: "healthy", 
        database: "connected",
        host: conn.connection.host
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { 
        status: "unhealthy", 
        database: "disconnected",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
