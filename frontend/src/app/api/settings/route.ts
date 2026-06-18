import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await dbConnect();
    // Use .lean() to bypass mongoose caching of schema properties
    let settings = await Settings.findOne({}).lean();
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
