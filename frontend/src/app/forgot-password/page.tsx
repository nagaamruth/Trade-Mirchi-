"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setResetUrl("");

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setStatus("success");
      if (res.data.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
    } catch (error: any) {
      setStatus("error");
      setErrorMsg(error.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="flex items-center gap-2 justify-center mb-10 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl transition-transform group-hover:scale-105">
            M
          </div>
          <span className="font-bold text-2xl tracking-tight">Trade Mirchi</span>
        </Link>

        <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {status === "success" ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <br/><span className="text-foreground font-medium">{email}</span>
              </p>

              {resetUrl && (
                <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5 text-left space-y-3">
                  <p className="text-xs text-primary font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Development Mode: No Email Sent
                  </p>
                  <p className="text-sm text-muted-foreground">Click the link below to reset your password directly:</p>
                  <Link href={resetUrl.replace(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", "")} className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Reset Password Now
                  </Link>
                </div>
              )}

              <Link href="/login">
                <Button className="w-full rounded-full h-12">Return to Login</Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {status === "error" && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-6 text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/30 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={status === "loading" || !email} 
                  className="w-full h-12 rounded-full text-base font-medium"
                >
                  {status === "loading" ? "Sending..." : "Send Reset Link"}
                  {!status && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
