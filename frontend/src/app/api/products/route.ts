import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get("admin") === "true";
    const query = isAdmin ? {} : { status: "active" };
    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}

// Optional: POST method for Admin to add products
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const product = await Product.create(data);
    return NextResponse.json({ message: "Product created", product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
