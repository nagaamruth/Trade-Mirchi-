"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export default function HomeActions() {
  const { user } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (user) {
    return (
      <Link href={user.role === "admin" || user.role === "superadmin" ? "/admin" : "/products"}>
        <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-14 px-10 text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
          Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/register">
      <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-14 px-10 text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
        Join the Network <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </Link>
  );
}
