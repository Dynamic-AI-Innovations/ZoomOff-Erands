"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package, PlusCircle, Search, ChevronRight, Filter,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Task = {
  id: string; category: string; status: string;
  pickup_address: string; destination_address: string | null; created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  posted: "Finding Runner", assigned: "Assigned", en_route: "En Route",
  in_progress: "In Progress", completed: "Completed",
  cancelled: "Cancelled", disputed: "Disputed",
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

type FilterTab = "all" | "active" | "completed" | "cancelled";
const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "active",    label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function BusinessTasksPage() {
  const router = useRouter();
  const [tasks, setTasks]     = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [tab, setTab]         = React.useState<FilterTab>("all");
  const [search, setSearch]   = React.useState("");

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const { data } = await supabase.from("tasks")
        .select("id, category, status, pickup_address, destination_address, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      setTasks(data ?? []);
      setLoading(false);
    });
  }, [router]);

  const ACTIVE = ["posted", "assigned", "en_route", "in_progress"];
  const displayed = tasks.filter(t => {
    if (tab === "active"    && !ACTIVE.includes(t.status)) return false;
    if (tab === "completed" && t.status !== "completed") return false;
    if (tab === "cancelled" && t.status !== "cancelled" && t.status !== "disputed") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.category.toLowerCase().includes(q) ||
             t.pickup_address.toLowerCase().includes(q);
    }
    return true;
  });

  const counts: Record<string, number> = {
    all: tasks.length,
    active: tasks.filter(t => ACTIVE.includes(t.status)).length,
    completed: tasks.filter(t => t.status === "completed").length,
    cancelled: tasks.filter(t => t.status === "cancelled" || t.status === "disputed").length,
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">Task Board</h1>
        <Button variant="primary" size="sm" asChild>
          <Link href="/delegate">
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> New Task
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted pointer-events-none" />
        <input type="text" placeholder="Search tasks…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-zo-border bg-white pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="h-3.5 w-3.5 text-zo-muted shrink-0" />
        {TABS.map(t => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={cn(
              "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors shrink-0",
              tab === t.key
                ? "bg-brand-charcoal text-white"
                : "bg-white border border-zo-border text-zo-muted hover:text-brand-charcoal"
            )}>
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zo-border bg-white p-10 text-center">
          <Package className="h-10 w-10 text-brand-gold/50 mx-auto mb-3" />
          <p className="text-sm font-semibold text-brand-charcoal">No tasks found</p>
          <p className="text-xs text-zo-muted mt-1 mb-4">Post your first business errand to get started.</p>
          <Button variant="primary" size="sm" asChild>
            <Link href="/delegate">Request an Errand</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(task => {
            const isActive = ACTIVE.includes(task.status);
            const dateStr = new Date(task.created_at).toLocaleDateString("en-NG", {
              day: "numeric", month: "short", year: "numeric",
            });
            return (
              <Link key={task.id} href={`/track/${task.id}`}
                className="flex items-center gap-3 rounded-xl border border-zo-border bg-white px-4 py-4 hover:border-brand-gold/40 hover:shadow-sm transition-all group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10">
                  <Package className="h-5 w-5 text-brand-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-brand-charcoal">{task.category}</p>
                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      STATUS_COLOR[task.status] ?? "text-gray-600 bg-gray-50 border-gray-200")}>
                      {STATUS_LABEL[task.status] ?? task.status}
                    </span>
                  </div>
                  <p className="text-xs text-zo-muted mt-0.5 truncate">{task.pickup_address}</p>
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
    </div>
  );
}
