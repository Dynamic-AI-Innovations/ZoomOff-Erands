"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, LogOut, Package, MapPin, Clock,
  CheckCircle2, ChevronRight, Loader2, RefreshCw,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Task = {
  id: string;
  category: string;
  description: string;
  status: string;
  pickup_address: string;
  destination_address: string | null;
  schedule_type: string;
  scheduled_at: string | null;
  created_at: string;
  runner_id: string | null;
};

type TabKey = "available" | "active" | "completed";

const TABS: { key: TabKey; label: string }[] = [
  { key: "available", label: "Available" },
  { key: "active",    label: "My Active" },
  { key: "completed", label: "Completed" },
];

const EARNINGS: Record<string, number> = {
  "Grocery Shopping": 2500, "Document Delivery": 1500, "Food Pickup": 1800,
  "Bank Errand": 2000, "Pharmacy Run": 1500, "Airport Pickup": 5000,
  "Airport Drop-off": 5000, "Laundry": 1500, "Other": 2000,
};

function earning(category: string) { return EARNINGS[category] ?? 2000; }

export default function RunnerTasksPage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<TabKey>("available");
  const [available, setAvailable] = React.useState<Task[]>([]);
  const [active, setActive]       = React.useState<Task[]>([]);
  const [completed, setCompleted] = React.useState<Task[]>([]);
  const [loading, setLoading]     = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [accepting, setAccepting] = React.useState<Record<string, boolean>>({});
  const [userId, setUserId]       = React.useState<string | null>(null);

  async function loadTasks(uid: string) {
    setRefreshing(true);
    const [avRes, acRes, coRes] = await Promise.all([
      supabase.from("tasks")
        .select("id,category,description,status,pickup_address,destination_address,schedule_type,scheduled_at,created_at,runner_id")
        .eq("status", "posted").is("runner_id", null)
        .order("created_at", { ascending: false }).limit(30),
      supabase.from("tasks")
        .select("id,category,description,status,pickup_address,destination_address,schedule_type,scheduled_at,created_at,runner_id")
        .eq("runner_id", uid).in("status", ["assigned", "en_route", "in_progress"])
        .order("created_at", { ascending: false }),
      supabase.from("tasks")
        .select("id,category,description,status,pickup_address,destination_address,schedule_type,scheduled_at,created_at,runner_id")
        .eq("runner_id", uid).eq("status", "completed")
        .order("created_at", { ascending: false }).limit(20),
    ]);
    setAvailable(avRes.data ?? []);
    setActive(acRes.data ?? []);
    setCompleted(coRes.data ?? []);
    setRefreshing(false);
  }

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const { data: app } = await supabase
        .from("runner_applications").select("status")
        .eq("user_id", session.user.id).maybeSingle();
      if (!app || app.status !== "approved") { router.replace("/runner"); return; }
      setUserId(session.user.id);
      await loadTasks(session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  async function acceptTask(task: Task) {
    if (!userId) return;
    setAccepting(p => ({ ...p, [task.id]: true }));
    const { error } = await supabase.from("tasks")
      .update({ runner_id: userId, status: "assigned", updated_at: new Date().toISOString() })
      .eq("id", task.id).eq("status", "posted");
    if (!error) {
      setAvailable(p => p.filter(t => t.id !== task.id));
      setActive(p => [{ ...task, runner_id: userId, status: "assigned" }, ...p]);
      setTab("active");
    }
    setAccepting(p => ({ ...p, [task.id]: false }));
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

  const tabTasks = tab === "available" ? available : tab === "active" ? active : completed;
  const counts = { available: available.length, active: active.length, completed: completed.length };

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
        <div className="flex items-center justify-between">
          <Link href="/runner" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
            <ArrowLeft className="h-4 w-4" /> Runner Portal
          </Link>
          <button type="button" onClick={() => userId && loadTasks(userId)} disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-medium text-zo-muted hover:text-brand-charcoal transition-colors">
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} /> Refresh
          </button>
        </div>

        <h1 className="font-display text-xl font-extrabold text-brand-charcoal">Task Feed</h1>

        {/* Tabs */}
        <div className="flex rounded-xl bg-white border border-zo-border p-1 gap-1">
          {TABS.map(t => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition-all",
                tab === t.key ? "bg-brand-charcoal text-white shadow-sm" : "text-zo-muted hover:text-brand-charcoal"
              )}>
              {t.label}
              {counts[t.key] > 0 && (
                <span className={cn("ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                  tab === t.key ? "bg-white/20" : "bg-brand-gold/20 text-brand-gold")}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Task list */}
        {tabTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zo-border bg-white p-10 text-center">
            <Package className="h-10 w-10 text-brand-gold/50 mx-auto mb-3" />
            <p className="text-sm font-semibold text-brand-charcoal">
              {tab === "available" ? "No tasks available right now" :
               tab === "active"    ? "No active tasks" : "No completed tasks yet"}
            </p>
            <p className="text-xs text-zo-muted mt-1">
              {tab === "available" ? "Check back soon — new errands are posted frequently." :
               tab === "active"    ? "Accept a task from the Available tab." :
               "Your completed errands will appear here."}
            </p>
            {tab === "available" && (
              <button type="button" onClick={() => userId && loadTasks(userId)} disabled={refreshing}
                className="mt-3 text-xs text-brand-gold hover:underline">
                Refresh feed
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tabTasks.map(task => {
              const isAccepting = accepting[task.id];
              const est = earning(task.category);
              const dateStr = new Date(task.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
              const timeStr = new Date(task.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

              return (
                <div key={task.id} className="rounded-2xl bg-white border border-zo-border p-5 space-y-3 hover:border-brand-gold/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 shrink-0">
                        <Package className="h-5 w-5 text-brand-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-charcoal text-sm">{task.category}</p>
                        <p className="text-xs text-zo-muted">{dateStr} · {timeStr}</p>
                      </div>
                    </div>
                    {tab === "available" && (
                      <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-xs font-bold text-green-700 shrink-0">
                        ~₦{est.toLocaleString()}
                      </span>
                    )}
                    {tab === "active" && (
                      <Link href={`/runner/tasks/${task.id}`}
                        className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700 flex items-center gap-1 shrink-0">
                        Manage <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                    {tab === "completed" && (
                      <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-xs font-bold text-green-700 shrink-0">
                        +₦{est.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zo-muted leading-relaxed line-clamp-2">{task.description}</p>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      <span className="font-medium text-brand-charcoal">Pickup:</span>
                      <span className="text-zo-muted truncate">{task.pickup_address}</span>
                    </div>
                    {task.destination_address && (
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="font-medium text-brand-charcoal">Drop-off:</span>
                        <span className="text-zo-muted truncate">{task.destination_address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-zo-muted">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{task.schedule_type === "asap" ? "ASAP" : task.scheduled_at ? new Date(task.scheduled_at).toLocaleString("en-NG") : "Scheduled"}</span>
                    </div>
                  </div>

                  {tab === "available" && (
                    <Button variant="primary" size="md" className="w-full" onClick={() => acceptTask(task)} disabled={isAccepting}>
                      {isAccepting
                        ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Accepting…</>
                        : <><CheckCircle2 className="h-4 w-4 mr-2" />Accept Task — ₦{est.toLocaleString()}</>
                      }
                    </Button>
                  )}
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
