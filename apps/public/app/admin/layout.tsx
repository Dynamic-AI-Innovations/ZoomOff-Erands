"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, UserCheck, AlertTriangle,
  Users, LogOut, Menu, X, ShieldCheck, Bell,
} from "lucide-react";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

const NAV_LINKS = [
  { href: "/admin",               label: "Overview",      icon: LayoutDashboard },
  { href: "/admin/tasks",         label: "Tasks",         icon: Package },
  { href: "/admin/runners",       label: "Runners",       icon: UserCheck },
  { href: "/admin/disputes",      label: "Disputes",      icon: AlertTriangle },
  { href: "/admin/users",         label: "Users",         icon: Users },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const role = session.user.user_metadata?.role as string | undefined;
      if (role !== "admin") { router.replace("/dashboard"); return; }
      setAuthorized(true);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Admin top bar */}
      <header className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/admin">
              <Image
                src="/logo.png"
                alt="ZoomOff Errands"
                width={90}
                height={36}
                className="h-8 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-2.5 py-1">
              <ShieldCheck className="h-3 w-3 text-brand-gold" />
              <span className="text-xs font-bold text-brand-gold">Admin</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 mx-4">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  pathname === href
                    ? "bg-brand-gold/20 text-brand-gold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden items-center justify-center rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-zinc-800 bg-zinc-900 px-4 pb-4 pt-2">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-brand-gold/20 text-brand-gold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border-t border-zinc-800 mt-1 pt-3"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
