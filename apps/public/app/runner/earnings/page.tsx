"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, LogOut, TrendingUp, Package, Wallet,
  Calendar, ChevronRight,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Task = {
  id: string; category: string; pickup_address: string;
  destination_address: string | null; created_at: string;
};

const EARNINGS: Record<string, number> = {
  "Grocery Shopping": 2500, "Document Delivery": 1500, "Food Pickup": 1800,
  "Bank Errand": 2000, "Pharmacy Run": 1500, "Airport Pickup": 5000,
  "Airport Drop-off": 5000, "Laundry": 1500, "Other": 2000,
};

function est(cat: string) { return EARNINGS[cat] ?? 2000; }

export default function RunnerEarningsPage() {
  const router = useRouter();
  const [tasks, setTasks]     = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const { data } = await supabase.from("tasks")
        .select("id, category, pickup_address, destination_address, created_at")
        .eq("runner_id", session.user.id).eq("status", "completed")
        .order("created_at", { ascending: false });
      setTasks(data ?? []);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  async function handleSignOut() { await supabase.auth.signOut(); router.push("/"); }

  if (loading) return (
    <div className="min-h-screen bg-zo-bg-light flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
    </div>
  );

  const now          = new Date();
  const thisMonthTasks = tasks.filter(t => {
    const d = new Date(t.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonthTasks = tasks.filter(t => {
    const d = new Date(t.created_at);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  });

  const totalEarnings     = tasks.reduce((s, t) => s + est(t.category), 0);
  const monthEarnings     = thisMonthTasks.reduce((s, t) => s + est(t.category), 0);
  const lastMonthEarnings = lastMonthTasks.reduce((s, t) => s + est(t.category), 0);

  return (
    <div className="min-h-screen bg-zo-bg-light">
      <header className="bg-white border-b border-zo-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/"><Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority /></Link>
          <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <Link href="/runner" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Runner Portal
        </Link>

        <h1 className="font-display text-xl font-extrabold text-brand-charcoal">Earnings</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white border border-zo-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-brand-gold" />
              <p className="text-xs text-zo-muted">This Month</p>
            </div>
            <p className="font-display text-2xl font-extrabold text-brand-charcoal">
              ₦{monthEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-zo-muted">{thisMonthTasks.length} errands</p>
          </div>
          <div className="rounded-2xl bg-white border border-zo-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-zo-muted">All Time</p>
            </div>
            <p className="font-display text-2xl font-extrabold text-brand-charcoal">
              ₦{totalEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-zo-muted">{tasks.length} errands total</p>
          </div>
        </div>

        {lastMonthEarnings > 0 && (
          <div className="rounded-xl bg-zo-bg-light border border-zo-border px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-zo-muted">Last month</p>
            <p className="text-sm font-bold text-brand-charcoal">₦{lastMonthEarnings.toLocaleString()}</p>
          </div>
        )}

        {/* Payout info */}
        <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/20">
              <Wallet className="h-4 w-4 text-brand-gold" />
            </div>
            <p className="font-semibold text-brand-charcoal text-sm">Payment Schedule</p>
          </div>
          <p className="text-xs text-zo-muted leading-relaxed">
            Earnings are settled weekly every <strong className="text-brand-charcoal">Friday</strong> to your registered bank account.
            Bank account management and instant withdrawal are coming soon.
          </p>
        </div>

        {/* Link to task feed */}
        <Link href="/runner/tasks"
          className="flex items-center justify-between rounded-2xl bg-brand-charcoal px-5 py-4 text-white hover:bg-brand-charcoal/90 transition-colors">
          <div>
            <p className="font-semibold text-sm">Accept more tasks</p>
            <p className="text-xs text-gray-400">View available errands in your area</p>
          </div>
          <ChevronRight className="h-5 w-5 text-brand-gold" />
        </Link>

        {/* Completed task list */}
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zo-border bg-white p-10 text-center">
            <Package className="h-10 w-10 text-brand-gold/50 mx-auto mb-3" />
            <p className="text-sm font-semibold text-brand-charcoal">No completed tasks yet</p>
            <p className="text-xs text-zo-muted mt-1">Accept and complete tasks to see your earnings here.</p>
            <Button variant="primary" size="sm" className="mt-4" asChild>
              <Link href="/runner/tasks">Browse Tasks</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="font-display text-sm font-bold text-brand-charcoal">Completed Errands</h2>
            {tasks.map(task => {
              const earn  = est(task.category);
              const dateStr = new Date(task.created_at).toLocaleDateString("en-NG", {
                day: "numeric", month: "short", year: "numeric",
              });
              return (
                <div key={task.id}
                  className="flex items-center gap-3 rounded-xl border border-zo-border bg-white px-4 py-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-charcoal">{task.category}</p>
                    <p className="text-xs text-zo-muted truncate">{task.pickup_address}</p>
                    <p className="text-xs text-zo-muted/70">{dateStr}</p>
                  </div>
                  <p className="font-bold text-green-600 text-sm shrink-0">+₦{earn.toLocaleString()}</p>
                </div>
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
