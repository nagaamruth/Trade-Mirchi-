"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, user } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pathname.startsWith("/admin")) return null;

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Market", href: "/products", icon: Package },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: mounted ? cart.length : 0 },
    { name: "Profile", href: mounted && user ? (user.role === "admin" || user.role === "superadmin" ? "/admin" : "/profile") : "/login", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-auto max-w-[90vw]">
      <nav className="bg-background/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full flex items-center justify-center p-2 gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative p-3 rounded-full transition-all ${
                isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon className="w-6 h-6" />
              {link.badge !== undefined && link.badge > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-background">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
