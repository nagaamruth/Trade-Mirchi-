import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // Fetch the single settings document or create it if missing
    let settings: any = await Settings.findOne({}).lean();
    if (!settings) {
      settings = await Settings.create({ allowRetailUnits: true });
      settings = await Settings.findOne({}).lean();
    }

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
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin" && payload.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const data = await req.json();

    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create(data);
    } else {
      settings = await Settings.findOneAndUpdate({}, data, { new: true });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
