"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/app/lib/auth-client";

export const RootHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data: sessionData, isPending } = authClient.useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
        (scrolled
          ? "backdrop-blur-md bg-background/80 border-b border-border/50"
          : "bg-transparent border-b border-transparent")
      }
    >
      <div className="px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border flex items-center justify-center font-[var(--font-bebas)] text-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Image src="/logo.jpg" alt="Logo" width={32} height={32} />
          </div>
          <span className="font-[var(--font-bebas)] text-xl tracking-wide text-foreground">
            EDORA
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a
            href="#hero"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#work"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Who It&apos;s For
          </a>
          <a
            href="#pricing"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#colophon"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Docs
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Button asChild disabled={isPending} variant="outline">
            <Link
              href={isPending ? "#" : sessionData ? "/dashboard" : "/sign-in"}
              className=""
            >
              {isPending ? "Loading..." : sessionData ? "Dashboard" : "Sign in"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
