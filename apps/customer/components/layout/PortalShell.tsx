"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, PlusCircle, ClipboardList, Wallet,
  User, Bell, LogOut, Menu, X,
} from "lucide-react";
import { cn, Avatar, Badge } from "@zoomoff/ui";
import { useAuthStore } from "@zoomoff/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Post Errand", href: "/post-errand", icon: PlusCircle },
  { label: "My Tasks", href: "/tasks", icon: ClipboardList },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Profile", href: "/profile", icon: User },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-zo-bg-light">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-zo-border transition-transform duration-200",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-zo-border">
          <Link href="/dashboard">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" unoptimized />
          </Link>
          <button
            className="md:hidden p-1 rounded-lg hover:bg-zo-bg-light"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-gold/10 text-brand-charcoal"
                    : "text-zo-muted hover:bg-zo-bg-light hover:text-brand-charcoal"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn("h-5 w-5", active ? "text-brand-gold" : "")}
                  aria-hidden="true"
                />
                {label}
                {href === "/post-errand" && (
                  <Badge variant="gold" className="ml-auto text-2xs">New</Badge>
                )}
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
            <div className="flex items-center gap-3">
              <Avatar name={user.name} src={user.profilePhotoUrl} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-charcoal truncate">{user.name}</p>
                <p className="text-xs text-zo-muted truncate">{user.email ?? user.phone}</p>
              </div>
              <button
                className="p-1.5 rounded-lg text-zo-muted hover:text-zo-error hover:bg-zo-error-light"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zo-border bg-white px-4 md:px-6">
          <button
            className="flex items-center justify-center rounded-lg p-2 hover:bg-zo-bg-light md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 md:flex-none" />

          <div className="flex items-center gap-3">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-zo-bg-light"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-zo-muted" aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-zo-error" aria-label="Unread notifications" />
            </button>
            {user && (
              <Avatar name={user.name} src={user.profilePhotoUrl} size="sm" />
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
