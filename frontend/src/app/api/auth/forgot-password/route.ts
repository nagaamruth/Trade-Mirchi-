import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "No account found with that email address." }, { status: 404 });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Trade Mirchi <noreply@trademirchi.com>",
          to: email,
          subject: "Password Reset Request - Trade Mirchi",
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #ea580c;">Trade Mirchi Password Reset</h2>
              <p>You requested a password reset. Click the button below to choose a new password. This link expires in 10 minutes.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `
        })
      });
      
      if (!resendRes.ok) {
        console.error("Resend Error:", await resendRes.text());
        return NextResponse.json({ message: "Failed to send email. Check API key." }, { status: 500 });
      }
      return NextResponse.json({ message: "If your email is in our system, you will receive a reset link shortly." }, { status: 200 });
    } else {
      // If no Resend API key, return the URL in the response for local testing
      console.log("No RESEND_API_KEY provided. Reset URL:", resetUrl);
      return NextResponse.json({ 
        message: "Development Mode: Email service not configured.",
        resetUrl: resetUrl 
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
