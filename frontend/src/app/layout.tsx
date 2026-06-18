import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Providers from "@/components/Providers";
import FloatingSupport from "@/components/FloatingSupport";
import MobileBottomNav from "@/components/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trade Mirchi | Premium Agricultural Marketplace",
  description: "AI Powered Smart Agricultural Marketplace & Business Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <SmoothScroll>
            <AnnouncementBar />
            <Navbar />
            <div className="pb-16 md:pb-0">
              {children}
            </div>
            <FloatingSupport />
            <MobileBottomNav />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
