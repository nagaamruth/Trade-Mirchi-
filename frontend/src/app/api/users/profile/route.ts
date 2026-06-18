import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      photo: user.photo,
      addresses: user.addresses,
      kycStatus: user.kycStatus,
      kycDocuments: user.kycDocuments
    };

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.photo) updateData.photo = data.photo;
    if (data.addresses) updateData.addresses = data.addresses;
    if (data.kycStatus) updateData.kycStatus = data.kycStatus;
    if (data.kycDocuments) updateData.kycDocuments = data.kycDocuments;
    
    if (data.password && data.password.trim().length > 0) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await User.findByIdAndUpdate(decoded.id, { $set: updateData }, { new: true, strict: false }).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      photo: user.photo,
      addresses: user.addresses,
      kycStatus: user.kycStatus,
      kycDocuments: user.kycDocuments
    };

    return NextResponse.json({ message: "Profile updated successfully", user: safeUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
