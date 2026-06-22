"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, Loader2, Filter, MessageSquare } from "lucide-react";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Dispute = {
  id: string;
  task_id: string;
  filed_by: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
};

type FilterOpt = "all" | "open" | "resolved";

const STATUS_STYLE: Record<string, string> = {
  open:     "text-red-400   bg-red-400/10   border-red-400/20",
  resolved: "text-green-400 bg-green-400/10 border-green-400/20",
  closed:   "text-zinc-400  bg-zinc-400/10  border-zinc-400/20",
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = React.useState<Dispute[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<FilterOpt>("all");
  const [resolving, setResolving] = React.useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase
      .from("disputes")
      .select("id, task_id, filed_by, reason, description, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setDisputes(data ?? []);
        setLoading(false);
      });
  }, []);

  async function resolveDispute(id: string) {
    setResolving(p => ({ ...p, [id]: true }));
    const { error } = await supabase
      .from("disputes")
      .update({ status: "resolved" })
      .eq("id", id);
    if (!error) {
      setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "resolved" } : d));
    }
    setResolving(p => ({ ...p, [id]: false }));
  }

  const displayed = filter === "all" ? disputes : disputes.filter(d => d.status === filter);

  const counts = {
    all:      disputes.length,
    open:     disputes.filter(d => d.status === "open").length,
    resolved: disputes.filter(d => d.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Disputes</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          {counts.open} open · {counts.resolved} resolved
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5">
        <Filter className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
        {(["all", "open", "resolved"] as FilterOpt[]).map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === f
                ? "bg-brand-gold text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Disputes list */}
      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">No {filter === "all" ? "" : filter} disputes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(dispute => {
            const isOpen = dispute.status === "open";
            const isExpanded = expanded === dispute.id;
            const dateStr = new Date(dispute.created_at).toLocaleDateString("en-NG", {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <div
                key={dispute.id}
                className={cn(
                  "rounded-2xl border bg-zinc-900 overflow-hidden transition-colors",
                  isOpen ? "border-red-500/30" : "border-zinc-800"
                )}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isOpen ? "bg-red-500/20" : "bg-zinc-700/50"}`}>
                        <AlertTriangle className={`h-5 w-5 ${isOpen ? "text-red-400" : "text-zinc-500"}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{dispute.reason}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Task {dispute.task_id.slice(0, 8)}… · {dateStr}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0",
                      STATUS_STYLE[dispute.status] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                    )}>
                      {dispute.status}
                    </span>
                  </div>

                  {/* Description toggle */}
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : dispute.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    {isExpanded ? "Hide details" : "View details"}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 rounded-xl bg-zinc-800/60 border border-zinc-700 p-4">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Customer statement</p>
                      <p className="text-sm text-zinc-200 leading-relaxed">{dispute.description}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {isOpen && (
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => resolveDispute(dispute.id)}
                        disabled={resolving[dispute.id]}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500/20 border border-green-500/30 px-4 py-2.5 text-sm font-semibold text-green-400 hover:bg-green-500/30 transition disabled:opacity-50"
                      >
                        {resolving[dispute.id]
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <CheckCircle2 className="h-4 w-4" />
                        }
                        Mark as Resolved
                      </button>
                      <a
                        href={`mailto:support@zoomoff.africa?subject=Dispute ${dispute.id.slice(0, 8)} - ${dispute.reason}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-700/50 border border-zinc-600 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 transition"
                      >
                        Email User
                      </a>
                    </div>
                  )}

                  {!isOpen && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5">
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                      <p className="text-xs font-medium text-green-300">Resolved</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
