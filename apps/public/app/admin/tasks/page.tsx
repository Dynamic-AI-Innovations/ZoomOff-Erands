"use client";

import * as React from "react";
import { Package, Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Task = {
  id: string;
  user_id: string;
  category: string;
  description: string;
  status: string;
  pickup_address: string;
  destination_address: string | null;
  schedule_type: string;
  created_at: string;
  updated_at: string | null;
  runner_id: string | null;
};

const ALL_STATUSES = ["posted", "assigned", "en_route", "in_progress", "completed", "cancelled", "disputed"];

const STATUS_LABEL: Record<string, string> = {
  posted:      "Finding Runner", assigned: "Assigned", en_route: "En Route",
  in_progress: "In Progress",   completed: "Completed",
  cancelled:   "Cancelled",     disputed: "Disputed",
};

const STATUS_STYLE: Record<string, string> = {
  posted:      "text-amber-400  bg-amber-400/10  border-amber-400/20",
  assigned:    "text-blue-400   bg-blue-400/10   border-blue-400/20",
  en_route:    "text-blue-400   bg-blue-400/10   border-blue-400/20",
  in_progress: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  completed:   "text-green-400  bg-green-400/10  border-green-400/20",
  cancelled:   "text-zinc-400   bg-zinc-400/10   border-zinc-400/20",
  disputed:    "text-red-400    bg-red-400/10    border-red-400/20",
};

type FilterStatus = "all" | typeof ALL_STATUSES[number];

export default function AdminTasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<FilterStatus>("all");
  const [search, setSearch] = React.useState("");
  const [updating, setUpdating] = React.useState<Record<string, boolean>>({});
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase
      .from("tasks")
      .select("id, user_id, category, description, status, pickup_address, destination_address, schedule_type, created_at, updated_at, runner_id")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setTasks(data ?? []);
        setLoading(false);
      });
  }, []);

  async function changeStatus(taskId: string, newStatus: string) {
    setUpdating(p => ({ ...p, [taskId]: true }));
    setOpenDropdown(null);
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", taskId);
    if (!error) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
    setUpdating(p => ({ ...p, [taskId]: false }));
  }

  const displayed = tasks.filter(t => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.category.toLowerCase().includes(q) ||
        t.pickup_address.toLowerCase().includes(q) ||
        (t.destination_address ?? "").toLowerCase().includes(q) ||
        t.id.includes(q)
      );
    }
    return true;
  });

  const counts: Record<string, number> = { all: tasks.length };
  for (const t of tasks) {
    counts[t.status] = (counts[t.status] ?? 0) + 1;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5" onClick={() => setOpenDropdown(null)}>
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">All Tasks</h1>
        <p className="text-sm text-zinc-400 mt-0.5">{tasks.length} total tasks on the platform</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by category, pickup address, or task ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
        {(["all", ...ALL_STATUSES] as FilterStatus[]).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors shrink-0",
              filter === s
                ? "bg-brand-gold text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            )}
          >
            {s === "all" ? `All (${counts.all})` : `${STATUS_LABEL[s] ?? s} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Tasks table */}
      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <Package className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">No tasks match this filter</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Pickup</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-medium">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {displayed.map(task => (
                <tr key={task.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{task.category}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">{task.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell max-w-[180px] truncate">
                    {task.pickup_address}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                      STATUS_STYLE[task.status] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                    )}>
                      {STATUS_LABEL[task.status] ?? task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs hidden lg:table-cell">
                    {new Date(task.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="relative"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === task.id ? null : task.id)}
                        disabled={updating[task.id]}
                        className="flex items-center gap-1 rounded-lg bg-zinc-800 border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-zinc-600 transition disabled:opacity-50"
                      >
                        {updating[task.id]
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <><span>Set</span><ChevronDown className="h-3 w-3" /></>
                        }
                      </button>

                      {openDropdown === task.id && (
                        <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl overflow-hidden">
                          {ALL_STATUSES.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => changeStatus(task.id, s)}
                              className={cn(
                                "flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors text-left",
                                task.status === s
                                  ? "bg-brand-gold/20 text-brand-gold"
                                  : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                              )}
                            >
                              {STATUS_LABEL[s] ?? s}
                              {task.status === s && " ✓"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
