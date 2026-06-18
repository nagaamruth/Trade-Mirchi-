"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useLanguage } from "@/contexts/LanguageContext";

const navLinks = [
  { name: "Market", href: "/products" },
  { name: "Live Prices", href: "/live-prices" },
  { name: "Analytics", href: "/analytics" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollY } = useScroll();
  const { cart, user } = useStore();
  const { language, setLanguage, t } = useLanguage();
  
  // Hydration fix for Zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return pathname.startsWith("/admin") ? null : (
    <motion.header
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-white/10 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl transition-transform group-hover:scale-105">
            M
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">
            Trade Mirchi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (pathname === '/products') {
                  const newUrl = e.target.value ? `/products?q=${encodeURIComponent(e.target.value)}` : '/products';
                  window.history.pushState({}, '', newUrl);
                  // We can't easily trigger a re-render from here without a global state for search
                  // but in ProductsPage we use useSearchParams which might listen.
                  // For true live without reload in Next.js 13+ App router:
                  window.dispatchEvent(new Event('popstate'));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/products?q=${searchQuery}`;
                }
              }}
              className="bg-secondary/30 border border-white/5 focus:border-primary text-sm focus:outline-none w-32 md:w-48 px-3 py-1.5 rounded-full transition-all duration-300"
            />
            <button onClick={() => window.location.href = `/products?q=${searchQuery}`} className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <Link href="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {mounted && cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          
          <div className="hidden md:flex items-center gap-3 border-l border-border pl-4 ml-2">
            {/* Language Toggle */}
            <div className="flex gap-1 mr-2 bg-secondary/30 rounded-full p-1 border border-white/5">
              {(["en", "te", "hi"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2 py-0.5 text-xs rounded-full font-medium transition-colors ${
                    language === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {mounted && user ? (
              <Link 
                href={user.role === "superadmin" || user.role === "admin" ? "/admin" : "/profile"} 
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors bg-secondary/30 px-3 py-1.5 rounded-full border border-white/5"
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  {t("nav_login")}
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-6 md:hidden flex flex-col gap-6 shadow-2xl h-screen"
        >
          <nav className="flex flex-col gap-6 text-xl font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 mt-auto mb-20">
            {mounted && user ? (
              <Link href={user.role === "superadmin" || user.role === "admin" ? "/admin" : "/profile"} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center h-12 text-lg rounded-full gap-2">
                  <User className="w-5 h-5" />
                  My Profile
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center h-12 text-lg rounded-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center h-12 text-lg rounded-full bg-primary text-primary-foreground">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
