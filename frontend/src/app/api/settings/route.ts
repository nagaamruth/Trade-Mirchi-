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
      settings = await Settings.findOne({}).lean();
    }
    
    // Inject defaults for older documents that don't have these fields
    if (!settings.liveRates || settings.liveRates.length === 0) {
      settings.liveRates = [
        { commodity: "Premium Teja", price: "₹22,500/q" },
        { commodity: "Guntur Sannam", price: "₹18,200/q" },
        { commodity: "Turmeric Finger", price: "₹14,500/q" },
        { commodity: "Cotton", price: "₹7,200/q" }
      ];
    }
    if (!settings.contactDetails) {
      settings.contactDetails = {
        email: "contact@trademirchi.com",
        phone: "+91 9059815694",
        whatsapp: "+91 9059815694",
        address: "Malakpet Mirchi Market, Hyderabad, Telangana, India",
        workingHours: "Mon-Sat: 9AM - 6PM"
      };
    }
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
