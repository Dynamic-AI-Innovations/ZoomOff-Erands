"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Cities", href: "/cities" },
  { label: "For Business", href: "/business" },
  { label: "Become a Runner", href: "/become-a-runner" },
  { label: "Blog", href: "/blog" },
];

type AuthState = "loading" | "authed" | "anon";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [authState, setAuthState] = React.useState<AuthState>("loading");

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(session ? "authed" : "anon");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "authed" : "anon");
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white transition-shadow duration-300",
        scrolled ? "shadow-card" : "border-b border-zo-border"
      )}
    >
      <div className="container-max section-padding flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0" aria-label="ZoomOff Errands home">
          <Image
            src="/logo.png"
            alt="ZoomOff Errands"
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
              className="text-sm font-medium text-zo-muted hover:text-brand-charcoal transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex min-w-[200px] justify-end">
          {authState === "loading" && (
            <div className="h-8 w-32 rounded-lg bg-zo-bg-light animate-pulse" />
          )}
          {authState === "anon" && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/get-started">Request an Errand</Link>
              </Button>
            </>
          )}
          {authState === "authed" && (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-zo-muted hover:text-brand-charcoal transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Button variant="primary" size="sm" asChild>
                <Link href="/delegate">New Errand</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-brand-charcoal hover:bg-zo-bg-light md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
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
            {authState === "authed" ? (
              <>
                <Button variant="outline" size="md" className="w-full" asChild>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                </Button>
                <Button variant="primary" size="md" className="w-full" asChild>
                  <Link href="/delegate" onClick={() => setOpen(false)}>New Errand</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="md" className="w-full" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
                </Button>
                <Button variant="primary" size="md" className="w-full" asChild>
                  <Link href="/get-started" onClick={() => setOpen(false)}>Request an Errand</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
