"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "For Business", href: "/business" },
  { label: "Become a Runner", href: "/become-a-runner" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur shadow-card" : "bg-transparent"
      )}
    >
      <div className="container-max section-padding flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0" aria-label="ZoomOff home">
          <Image
            src="/logo.png"
            alt="ZoomOff Errand Services"
            width={120}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled ? "text-zo-muted hover:text-brand-charcoal" : "text-white/80 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className={scrolled ? "" : "text-white hover:bg-white/10"} asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/register">Post an Errand</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className={cn(
            "flex items-center justify-center rounded-lg p-2 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
            scrolled ? "text-brand-charcoal hover:bg-zo-bg-light" : "text-white hover:bg-white/10"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-zo-border bg-white px-4 pb-4 pt-2 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-charcoal hover:bg-zo-bg-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-zo-border pt-3">
            <Button variant="outline" size="md" className="w-full" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button variant="primary" size="md" className="w-full" asChild>
              <Link href="/register">Post an Errand</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
