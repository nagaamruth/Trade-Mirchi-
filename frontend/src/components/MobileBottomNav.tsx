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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-around p-2 pb-[env(safe-area-inset-bottom,0.5rem)]">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isActive && link.href === pathname ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive && link.href === pathname ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] font-medium">{link.name}</span>
            {link.badge !== undefined && link.badge > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center rounded-full border border-background">
                {link.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
