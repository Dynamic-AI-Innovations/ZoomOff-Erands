"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut, PlusCircle, Clock, CheckCircle2, User,
  ArrowRight, Package, ChevronRight, Bell, Wallet, Settings,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Task = {
  id: string;
  category: string;
  status: string;
  pickup_address: string;
  destination_address: string | null;
  created_at: string;
};

const ACTIVE_STATUSES = ["posted", "assigned", "en_route", "in_progress"];

const STATUS_LABEL: Record<string, string> = {
  posted:      "Finding Runner",
  assigned:    "Runner Assigned",
  en_route:    "Runner En Route",
  in_progress: "In Progress",
  completed:   "Completed",
  cancelled:   "Cancelled",
  disputed:    "Disputed",
};

const STATUS_COLOR: Record<string, string> = {
  posted:      "text-amber-700 bg-amber-50 border-amber-200",
  assigned:    "text-blue-700 bg-blue-50 border-blue-200",
  en_route:    "text-blue-700 bg-blue-50 border-blue-200",
  in_progress: "text-orange-700 bg-orange-50 border-orange-200",
  completed:   "text-green-700 bg-green-50 border-green-200",
  cancelled:   "text-gray-500 bg-gray-50 border-gray-200",
  disputed:    "text-red-700 bg-red-50 border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[status] ?? "text-gray-600 bg-gray-50 border-gray-200"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function TaskRow({ task }: { task: Task }) {
  const isActive = ACTIVE_STATUSES.includes(task.status);
  const date = new Date(task.created_at);
  const timeStr = date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Link
      href={`/track/${task.id}`}
      className="flex items-center gap-3 rounded-xl border border-zo-border bg-white px-4 py-3.5 hover:border-brand-gold/40 hover:shadow-sm transition-all group"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10">
        <Package className="h-4 w-4 text-brand-gold" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-brand-charcoal">{task.category}</p>
          <StatusBadge status={task.status} />
        </div>
        <p className="text-xs text-zo-muted mt-0.5 truncate">
          {task.pickup_address}
          {task.destination_address ? ` → ${task.destination_address}` : ""}
        </p>
        <p className="text-xs text-zo-muted/70 mt-0.5">{timeStr}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isActive && (
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
        )}
        <ChevronRight className="h-4 w-4 text-zo-muted group-hover:text-brand-charcoal transition-colors" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [runnerStatus, setRunnerStatus] = React.useState<string | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUser(session.user);

      const [runnerRes, tasksRes] = await Promise.all([
        supabase
          .from("runner_applications")
          .select("status")
          .eq("user_id", session.user.id)
          .maybeSingle(),
        supabase
          .from("tasks")
          .select("id, category, status, pickup_address, destination_address, created_at")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (runnerRes.data) setRunnerStatus(runnerRes.data.status);
      if (tasksRes.data) setTasks(tasksRes.data);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
      <div className="min-h-screen bg-zo-bg-light flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const name = (user?.user_metadata?.name as string) ?? user?.email ?? "there";
  const firstName = name.split(" ")[0];
  const isRunner = !!runnerStatus;

  const activeTasks = tasks.filter(t => ACTIVE_STATUSES.includes(t.status));
  const completedCount = tasks.filter(t => t.status === "completed").length;
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="min-h-screen bg-zo-bg-light">
      {/* Header */}
      <header className="bg-white border-b border-zo-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/delegate" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-charcoal hover:text-brand-gold transition-colors">
              <PlusCircle className="h-4 w-4" /> New errand
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Greeting */}
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-zo-muted mt-0.5">{user?.email}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Errands", value: tasks.length, color: "text-brand-charcoal" },
            { label: "Active", value: activeTasks.length, color: "text-amber-600" },
            { label: "Completed", value: completedCount, color: "text-green-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl bg-white border border-zo-border p-4 text-center">
              <p className={`font-display text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-xs text-zo-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Runner application status */}
        {isRunner && (
          <div className={`rounded-2xl border p-5 flex items-start gap-4 ${
            runnerStatus === "approved"
              ? "border-green-200 bg-green-50"
              : runnerStatus === "rejected"
                ? "border-red-200 bg-red-50"
                : "border-brand-gold/40 bg-brand-gold/5"
          }`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shrink-0">
              {runnerStatus === "approved"
                ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                : <Clock className="h-5 w-5 text-brand-gold" />
              }
            </div>
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">
                Runner Application — <span className="capitalize">{runnerStatus}</span>
              </p>
              <p className="text-xs text-zo-muted mt-0.5">
                {runnerStatus === "pending" && "We're reviewing your application. Usually within 2 hours."}
                {runnerStatus === "in_review" && "Your application is actively being reviewed by our team."}
                {runnerStatus === "approved" && "Congratulations! Your account is approved. Start accepting tasks."}
                {runnerStatus === "rejected" && "Your application was not approved. Contact support for details."}
              </p>
            </div>
          </div>
        )}

        {/* Active errands */}
        {activeTasks.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse inline-block" />
                Active Errands ({activeTasks.length})
              </h2>
              <Link href="/errands" className="text-xs text-brand-gold hover:underline">View all</Link>
            </div>
            <div className="space-y-2">
              {activeTasks.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
          </div>
        ) : (
          /* CTA if no active errands */
          <div className="rounded-2xl bg-brand-charcoal p-6 text-white">
            <h2 className="font-display text-lg font-bold mb-1">Need something done?</h2>
            <p className="text-sm text-gray-400 mb-4">
              Request an errand and get matched with a verified runner in minutes.
            </p>
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/delegate">
                <PlusCircle className="h-4 w-4 mr-2" aria-hidden="true" /> Request an Errand
              </Link>
            </Button>
          </div>
        )}

        {/* Recent errands */}
        {recentTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-brand-charcoal">My Errands</h2>
              <Link href="/errands" className="text-xs text-brand-gold hover:underline flex items-center gap-0.5">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentTasks.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
            {tasks.length > 5 && (
              <Link
                href="/errands"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zo-border bg-white py-3 text-sm font-medium text-brand-charcoal hover:border-brand-gold/50 transition-colors"
              >
                View all {tasks.length} errands <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}

        {/* No errands yet */}
        {tasks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zo-border bg-white p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10 mx-auto mb-4">
              <Bell className="h-7 w-7 text-brand-gold" aria-hidden="true" />
            </div>
            <p className="font-semibold text-brand-charcoal text-sm">No errands yet</p>
            <p className="text-xs text-zo-muted mt-1 mb-4">Your errand history will appear here once you make a request.</p>
            <Button variant="primary" size="sm" asChild>
              <Link href="/delegate">Request your first errand</Link>
            </Button>
          </div>
        )}

        {/* Quick links */}
        <div className="rounded-2xl bg-white border border-zo-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
              <User className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">{name}</p>
              <p className="text-xs text-zo-muted">{isRunner ? "Runner account" : "Customer account"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/delegate" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
              <span>Request an errand</span>
              <ChevronRight className="h-4 w-4 text-zo-muted" />
            </Link>
            <Link href="/errands" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
              <span>My errand history</span>
              <ChevronRight className="h-4 w-4 text-zo-muted" />
            </Link>
            <Link href="/wallet" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
              <span className="flex items-center gap-2"><Wallet className="h-4 w-4 text-zo-muted" />My wallet</span>
              <ChevronRight className="h-4 w-4 text-zo-muted" />
            </Link>
            <Link href="/notifications" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
              <span className="flex items-center gap-2"><Bell className="h-4 w-4 text-zo-muted" />Notifications</span>
              <ChevronRight className="h-4 w-4 text-zo-muted" />
            </Link>
            <Link href="/profile" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
              <span className="flex items-center gap-2"><Settings className="h-4 w-4 text-zo-muted" />Profile &amp; settings</span>
              <ChevronRight className="h-4 w-4 text-zo-muted" />
            </Link>
            {isRunner && (
              <Link href="/runner" className="flex items-center justify-between rounded-xl border border-brand-gold/30 bg-brand-gold/5 px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/60 hover:bg-brand-gold/10 transition-colors">
                <span className="font-semibold">Runner Portal</span>
                <ChevronRight className="h-4 w-4 text-brand-gold" />
              </Link>
            )}
            {!isRunner && (
              <Link href="/runner-apply" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
                <span>Become a runner</span>
                <ChevronRight className="h-4 w-4 text-zo-muted" />
              </Link>
            )}
          </div>
        </div>

        <p className="text-center text-2xs text-zo-muted/60 tracking-wide pb-4">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
