"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, BarChart3, Users, CreditCard, Key, Menu, X, Bell } from "lucide-react";
import { cn, Avatar } from "@zoomoff/ui";
import { useAuthStore } from "@zoomoff/auth";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: ClipboardList },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Team", href: "/team", icon: Users },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "API Access", href: "/api-access", icon: Key },
];

export function BusinessPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-zo-bg-light">
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-white border-r border-zo-border transition-transform md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-zo-border">
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <Image src="/logo.png" alt="ZoomOff Errands" width={80} height={32} className="h-8 w-auto object-contain" unoptimized />
            <span className="text-xs font-semibold tracking-widest uppercase text-zo-muted">Business</span>
          </Link>
          <button className="md:hidden p-1 rounded" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-brand-gold/10 text-brand-charcoal" : "text-zo-muted hover:bg-zo-bg-light hover:text-brand-charcoal")}
                aria-current={active ? "page" : undefined}>
                <Icon className={cn("h-4 w-4", active ? "text-brand-gold" : "")} aria-hidden="true" />{label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-2 border-t border-zo-border">
          <p className="text-2xs text-zo-muted text-center tracking-wide">
            Powered by <span className="text-brand-gold font-medium">Dynamics Technology</span>
          </p>
        </div>

        {user && (
          <div className="border-t border-zo-border p-4">
            <div className="flex items-center gap-2">
              <Avatar name={user.name} src={user.profilePhotoUrl} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{user.name}</p>
                <p className="text-2xs text-zo-muted truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} aria-hidden />}
      <div className="flex flex-1 flex-col md:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zo-border bg-white px-4 md:px-6">
          <button className="md:hidden p-2 rounded-lg hover:bg-zo-bg-light" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div className="flex-1" />
          <button className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-zo-bg-light" aria-label="Notifications"><Bell className="h-5 w-5 text-zo-muted" /></button>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
