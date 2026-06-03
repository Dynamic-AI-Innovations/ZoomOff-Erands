"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Users, Flag, Shield, DollarSign, ClipboardList, AlertTriangle, Settings, Menu, X } from "lucide-react";
import { cn } from "@zoomoff/ui";
import { useAuthStore } from "@zoomoff/auth";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Live Map", href: "/map", icon: Map },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Runners", href: "/runners", icon: Flag },
  { label: "Disputes", href: "/disputes", icon: Shield },
  { label: "Finance", href: "/finance", icon: DollarSign },
  { label: "Tasks", href: "/tasks", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AdminConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-zo-bg-dark">
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-56 flex-col bg-black border-r border-white/10 transition-transform md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-14 items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gold font-display font-bold text-brand-charcoal text-sm">Z</span>
            <span className="font-display text-sm font-bold text-white">Admin</span>
          </div>
          <button className="md:hidden p-1 text-gray-400 hover:text-white rounded" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>

        {/* Role badge */}
        {user && (
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <span className={cn("text-2xs font-semibold rounded px-1.5 py-0.5 mt-0.5 inline-block", user.role === "zo_super_admin" ? "bg-brand-gold text-brand-charcoal" : "bg-white/10 text-gray-300")}>
              {user.role === "zo_super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>
        )}

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const isSuperOnly = href === "/settings";
            const isLocked = isSuperOnly && user?.role !== "zo_super_admin";
            if (isLocked) return null;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-brand-gold/20 text-brand-gold" : "text-gray-400 hover:bg-white/5 hover:text-white")}
                aria-current={active ? "page" : undefined}>
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />{label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <div className="flex flex-1 flex-col md:pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur px-4">
          <button className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-zo-success inline-block" aria-hidden />
            All systems operational
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
