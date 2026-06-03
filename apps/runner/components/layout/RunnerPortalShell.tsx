"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, DollarSign, User, Wifi, WifiOff } from "lucide-react";
import { cn, Badge } from "@zoomoff/ui";
import { useAuthStore } from "@zoomoff/auth";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Task Feed", href: "/tasks/feed", icon: ListChecks },
  { label: "Earnings", href: "/earnings", icon: DollarSign },
  { label: "Profile", href: "/profile", icon: User },
];

export function RunnerPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isOnline, setIsOnline] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-zo-bg-light">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zo-border bg-white px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gold font-display text-base font-bold text-brand-charcoal">Z</span>
          <span className="font-display text-base font-bold text-brand-charcoal">Runner</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zo-muted">{user?.name}</span>
          <button
            onClick={() => setIsOnline((v) => !v)}
            className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors", isOnline ? "bg-zo-success-light text-zo-success" : "bg-zo-bg-light text-zo-muted")}
            aria-label={isOnline ? "Go offline" : "Go online"}
          >
            {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">{children}</main>

      {/* Bottom nav (mobile-first for runners) */}
      <nav className="sticky bottom-0 border-t border-zo-border bg-white" aria-label="Runner navigation">
        <div className="flex">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn("flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors", active ? "text-brand-gold" : "text-zo-muted")}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
