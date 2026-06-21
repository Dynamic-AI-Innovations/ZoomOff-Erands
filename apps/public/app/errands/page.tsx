"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, LogOut, Package, ChevronRight, PlusCircle, Search,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Task = {
  id: string;
  category: string;
  status: string;
  pickup_address: string;
  destination_address: string | null;
  created_at: string;
};

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

const ACTIVE_STATUSES = ["posted", "assigned", "en_route", "in_progress"];

type FilterTab = "all" | "active" | "completed" | "cancelled";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "active",    label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled / Disputed" },
];

function filterTasks(tasks: Task[], tab: FilterTab, search: string): Task[] {
  let filtered = tasks;
  if (tab === "active") filtered = tasks.filter(t => ACTIVE_STATUSES.includes(t.status));
  else if (tab === "completed") filtered = tasks.filter(t => t.status === "completed");
  else if (tab === "cancelled") filtered = tasks.filter(t => t.status === "cancelled" || t.status === "disputed");

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(t =>
      t.category.toLowerCase().includes(q) ||
      t.pickup_address.toLowerCase().includes(q) ||
      (t.destination_address ?? "").toLowerCase().includes(q)
    );
  }
  return filtered;
}

export default function ErrandsPage() {
  const router = useRouter();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<FilterTab>("all");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }

      const { data } = await supabase
        .from("tasks")
        .select("id, category, status, pickup_address, destination_address, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setTasks(data ?? []);
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

  const displayed = filterTasks(tasks, activeTab, search);

  return (
    <div className="min-h-screen bg-zo-bg-light">
      {/* Header */}
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
        {/* Back + heading */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-extrabold text-brand-charcoal">My Errands</h1>
          <Button variant="primary" size="sm" asChild>
            <Link href="/delegate">
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> New
            </Link>
          </Button>
        </div>

        {/* Search */}
        {tasks.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" />
            <input
              type="text"
              placeholder="Search errands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-zo-border bg-white pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
            />
          </div>
        )}

        {/* Filter tabs */}
        {tasks.length > 0 && (
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-0.5 px-0.5">
            {TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0",
                  activeTab === tab.key
                    ? "bg-brand-charcoal text-white"
                    : "bg-white border border-zo-border text-zo-muted hover:text-brand-charcoal hover:border-brand-gold/40"
                )}
              >
                {tab.label}
                {tab.key !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    ({filterTasks(tasks, tab.key, "").length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Task list */}
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zo-border bg-white p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10 mx-auto mb-4">
              <Package className="h-7 w-7 text-brand-gold" />
            </div>
            <p className="font-semibold text-brand-charcoal text-sm">No errands yet</p>
            <p className="text-xs text-zo-muted mt-1 mb-4">Your errand history will appear here once you make a request.</p>
            <Button variant="primary" size="sm" asChild>
              <Link href="/delegate">Request your first errand</Link>
            </Button>
          </div>
        ) : displayed.length === 0 ? (
          <div className="rounded-2xl border border-zo-border bg-white p-8 text-center">
            <p className="text-sm text-zo-muted">No errands match this filter.</p>
            <button
              type="button"
              onClick={() => { setActiveTab("all"); setSearch(""); }}
              className="mt-2 text-xs text-brand-gold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map(task => {
              const date = new Date(task.created_at);
              const dateStr = date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
              const isActive = ACTIVE_STATUSES.includes(task.status);

              return (
                <Link
                  key={task.id}
                  href={`/track/${task.id}`}
                  className="flex items-center gap-3 rounded-xl border border-zo-border bg-white px-4 py-4 hover:border-brand-gold/40 hover:shadow-sm transition-all group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10">
                    <Package className="h-5 w-5 text-brand-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-brand-charcoal">{task.category}</p>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[task.status] ?? "text-gray-600 bg-gray-50 border-gray-200"}`}>
                        {STATUS_LABEL[task.status] ?? task.status}
                      </span>
                    </div>
                    <p className="text-xs text-zo-muted mt-0.5 truncate">
                      {task.pickup_address}
                      {task.destination_address ? ` → ${task.destination_address}` : ""}
                    </p>
                    <p className="text-xs text-zo-muted/70 mt-0.5">{dateStr}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isActive && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
                    <ChevronRight className="h-4 w-4 text-zo-muted group-hover:text-brand-charcoal transition-colors" />
                  </div>
                </Link>
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
