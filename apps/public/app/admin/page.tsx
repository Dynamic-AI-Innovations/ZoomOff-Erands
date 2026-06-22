"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package, UserCheck, AlertTriangle, Users, TrendingUp,
  CheckCircle2, Clock, ChevronRight, Activity,
} from "lucide-react";
import { supabase } from "@zoomoff/api-client";

type Stats = {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  pendingRunners: number;
  approvedRunners: number;
  openDisputes: number;
};

type RecentTask = {
  id: string;
  category: string;
  status: string;
  pickup_address: string;
  created_at: string;
};

const STATUS_COLOR: Record<string, string> = {
  posted:      "text-amber-400  bg-amber-400/10  border-amber-400/20",
  assigned:    "text-blue-400   bg-blue-400/10   border-blue-400/20",
  en_route:    "text-blue-400   bg-blue-400/10   border-blue-400/20",
  in_progress: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  completed:   "text-green-400  bg-green-400/10  border-green-400/20",
  cancelled:   "text-zinc-400   bg-zinc-400/10   border-zinc-400/20",
  disputed:    "text-red-400    bg-red-400/10    border-red-400/20",
};

const STATUS_LABEL: Record<string, string> = {
  posted: "Finding Runner", assigned: "Assigned", en_route: "En Route",
  in_progress: "In Progress", completed: "Completed",
  cancelled: "Cancelled", disputed: "Disputed",
};

function StatCard({
  label, value, sub, icon: Icon, accent,
}: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; accent: string;
}) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-zinc-400">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="font-display text-3xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = React.useState<Stats>({
    totalTasks: 0, activeTasks: 0, completedTasks: 0,
    pendingRunners: 0, approvedRunners: 0, openDisputes: 0,
  });
  const [recentTasks, setRecentTasks] = React.useState<RecentTask[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const [
        tasksRes,
        runnerRes,
        pendingRunnerRes,
        approvedRunnerRes,
        disputesRes,
        recentRes,
      ] = await Promise.all([
        supabase.from("tasks").select("status", { count: "exact" }),
        supabase.from("runner_applications").select("id", { count: "exact" }),
        supabase.from("runner_applications").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("runner_applications").select("id", { count: "exact" }).eq("status", "approved"),
        supabase.from("disputes").select("id", { count: "exact" }).eq("status", "open"),
        supabase.from("tasks").select("id, category, status, pickup_address, created_at")
          .order("created_at", { ascending: false }).limit(10),
      ]);

      const allTasks = tasksRes.data ?? [];
      const active = ["posted", "assigned", "en_route", "in_progress"];

      setStats({
        totalTasks: tasksRes.count ?? allTasks.length,
        activeTasks: allTasks.filter(t => active.includes(t.status)).length,
        completedTasks: allTasks.filter(t => t.status === "completed").length,
        pendingRunners: pendingRunnerRes.count ?? 0,
        approvedRunners: approvedRunnerRes.count ?? 0,
        openDisputes: disputesRes.count ?? 0,
      });
      setRecentTasks(recentRes.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Platform Overview</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Real-time platform statistics and recent activity</p>
      </div>

      {/* Alert cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.pendingRunners > 0 && (
          <Link
            href="/admin/runners"
            className="flex items-center gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 hover:border-amber-500/50 transition-colors group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 shrink-0">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{stats.pendingRunners} runner application{stats.pendingRunners !== 1 ? "s" : ""} pending</p>
              <p className="text-xs text-zinc-400">Requires your review and approval</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
          </Link>
        )}
        {stats.openDisputes > 0 && (
          <Link
            href="/admin/disputes"
            className="flex items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 hover:border-red-500/50 transition-colors group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{stats.openDisputes} open dispute{stats.openDisputes !== 1 ? "s" : ""}</p>
              <p className="text-xs text-zinc-400">Customers waiting for resolution</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
          </Link>
        )}
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="Total Tasks"      value={stats.totalTasks}     sub="all time"          icon={Package}    accent="bg-brand-gold/20 text-brand-gold" />
        <StatCard label="Active Tasks"     value={stats.activeTasks}    sub="in progress now"   icon={Activity}   accent="bg-amber-400/20 text-amber-400" />
        <StatCard label="Completed"        value={stats.completedTasks} sub="successfully done" icon={CheckCircle2} accent="bg-green-400/20 text-green-400" />
        <StatCard label="Pending Runners"  value={stats.pendingRunners} sub="awaiting approval" icon={Clock}      accent="bg-amber-400/20 text-amber-400" />
        <StatCard label="Active Runners"   value={stats.approvedRunners} sub="approved accounts" icon={UserCheck} accent="bg-blue-400/20 text-blue-400" />
        <StatCard label="Open Disputes"    value={stats.openDisputes}   sub="need resolution"   icon={AlertTriangle} accent="bg-red-400/20 text-red-400" />
      </div>

      {/* Recent tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Recent Tasks</h2>
          <Link href="/admin/tasks" className="text-xs text-brand-gold hover:underline">View all →</Link>
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          {recentTasks.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No tasks yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Pickup</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {recentTasks.map(task => (
                  <tr key={task.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{task.category}</td>
                    <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell max-w-[200px] truncate">{task.pickup_address}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[task.status] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"}`}>
                        {STATUS_LABEL[task.status] ?? task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs hidden md:table-cell">
                      {new Date(task.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <Link href="/admin/tasks" className="text-xs text-brand-gold hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/tasks",    label: "Manage Tasks",    icon: Package },
          { href: "/admin/runners",  label: "Approve Runners", icon: UserCheck },
          { href: "/admin/disputes", label: "Resolve Disputes",icon: AlertTriangle },
          { href: "/admin/users",    label: "View Users",      icon: Users },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center hover:border-zinc-700 hover:bg-zinc-800 transition-colors group"
          >
            <Icon className="h-5 w-5 text-zinc-500 group-hover:text-brand-gold transition-colors" />
            <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
