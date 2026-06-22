"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, LogOut, Bell, CheckCheck, Package,
  AlertTriangle, Star, Wallet, ChevronRight,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
};

const TYPE_ICON: Record<string, React.ElementType> = {
  errand_update: Package,
  payment: Wallet,
  rating: Star,
  dispute: AlertTriangle,
  default: Bell,
};

const TYPE_BG: Record<string, string> = {
  errand_update: "bg-brand-gold/10",
  payment: "bg-green-50",
  rating: "bg-yellow-50",
  dispute: "bg-red-50",
  default: "bg-zo-bg-light",
};

const TYPE_ICON_COLOR: Record<string, string> = {
  errand_update: "text-brand-gold",
  payment: "text-green-600",
  rating: "text-yellow-500",
  dispute: "text-red-500",
  default: "text-zo-muted",
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [tablesMissing, setTablesMissing] = React.useState(false);
  const [markingAll, setMarkingAll] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }

      const { data, error } = await supabase
        .from("notifications")
        .select("id, type, title, body, read, action_url, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error?.code === "42P01") {
        setTablesMissing(true);
      } else {
        setNotifications(data ?? []);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  async function markAllRead() {
    setMarkingAll(true);
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
    setMarkingAll(false);
  }

  async function markRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zo-bg-light flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-zo-bg-light">
      <header className="bg-white border-b border-zo-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-extrabold text-brand-charcoal">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-zo-muted mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              disabled={markingAll}
              className="text-xs gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
          )}
        </div>

        {tablesMissing ? (
          <div className="rounded-2xl border border-dashed border-zo-border bg-white p-8 text-center">
            <Bell className="h-10 w-10 text-zo-muted/40 mx-auto mb-3" />
            <p className="text-sm text-zo-muted">Notifications are being set up. Check back soon.</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zo-border bg-white p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10 mx-auto mb-4">
              <Bell className="h-7 w-7 text-brand-gold" />
            </div>
            <p className="font-semibold text-brand-charcoal text-sm">No notifications</p>
            <p className="text-xs text-zo-muted mt-1">
              Updates about your errands, payments, and account will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notif => {
              const Icon = TYPE_ICON[notif.type] ?? TYPE_ICON.default;
              const bg = TYPE_BG[notif.type] ?? TYPE_BG.default;
              const iconColor = TYPE_ICON_COLOR[notif.type] ?? TYPE_ICON_COLOR.default;
              const timeStr = (() => {
                const d = new Date(notif.created_at);
                const now = new Date();
                const diffMs = now.getTime() - d.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                if (diffMins < 1) return "Just now";
                if (diffMins < 60) return `${diffMins}m ago`;
                const diffHrs = Math.floor(diffMins / 60);
                if (diffHrs < 24) return `${diffHrs}h ago`;
                return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
              })();

              const Wrapper = notif.action_url ? Link : "div";
              const wrapperProps = notif.action_url
                ? { href: notif.action_url, onClick: () => markRead(notif.id) }
                : { onClick: () => markRead(notif.id) };

              return (
                <Wrapper
                  key={notif.id}
                  {...(wrapperProps as Record<string, unknown>)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-4 py-4 transition-all cursor-pointer",
                    notif.read
                      ? "border-zo-border bg-white"
                      : "border-brand-gold/30 bg-brand-gold/5",
                    notif.action_url && "hover:border-brand-gold/50 hover:shadow-sm group"
                  )}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-semibold", notif.read ? "text-brand-charcoal/80" : "text-brand-charcoal")}>
                        {notif.title}
                        {!notif.read && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-gold align-middle" />
                        )}
                      </p>
                      <p className="text-xs text-zo-muted shrink-0">{timeStr}</p>
                    </div>
                    <p className="text-xs text-zo-muted mt-0.5 leading-relaxed">{notif.body}</p>
                  </div>
                  {notif.action_url && (
                    <ChevronRight className="h-4 w-4 text-zo-muted group-hover:text-brand-charcoal transition-colors shrink-0 mt-0.5" />
                  )}
                </Wrapper>
              );
            })}
          </div>
        )}

        <p className="text-center text-2xs text-zo-muted/60 pb-4">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
