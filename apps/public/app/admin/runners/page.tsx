"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Clock, Loader2, UserCheck, Filter } from "lucide-react";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Application = {
  id: string;
  user_id: string;
  status: string;
  vehicle_type: string | null;
  bio: string | null;
  city: string | null;
  created_at: string;
};

const STATUS_OPTS = ["all", "pending", "in_review", "approved", "rejected"] as const;
type StatusOpt = typeof STATUS_OPTS[number];

const STATUS_STYLE: Record<string, string> = {
  pending:   "text-amber-400 bg-amber-400/10 border-amber-400/20",
  in_review: "text-blue-400  bg-blue-400/10  border-blue-400/20",
  approved:  "text-green-400 bg-green-400/10 border-green-400/20",
  rejected:  "text-red-400   bg-red-400/10   border-red-400/20",
};

function parseBio(bio: string | null): { phone?: string; city?: string } {
  if (!bio) return {};
  const phoneMatch = bio.match(/Phone:\s*([^|]+)/);
  const cityMatch  = bio.match(/City:\s*(.+)/);
  return {
    phone: phoneMatch?.[1]?.trim(),
    city:  cityMatch?.[1]?.trim(),
  };
}

export default function AdminRunnersPage() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<StatusOpt>("all");
  const [updating, setUpdating] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    supabase
      .from("runner_applications")
      .select("id, user_id, status, vehicle_type, bio, city, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setApplications(data ?? []);
        setLoading(false);
      });
  }, []);

  async function updateStatus(appId: string, newStatus: "approved" | "rejected" | "in_review") {
    setUpdating(p => ({ ...p, [appId]: true }));
    const { error } = await supabase
      .from("runner_applications")
      .update({ status: newStatus })
      .eq("id", appId);
    if (!error) {
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
      );
    }
    setUpdating(p => ({ ...p, [appId]: false }));
  }

  const displayed = filter === "all"
    ? applications
    : applications.filter(a => a.status === filter);

  const counts: Record<string, number> = {};
  for (const a of applications) {
    counts[a.status] = (counts[a.status] ?? 0) + 1;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">Runner Applications</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{applications.length} total applications</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
        <Filter className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
        {STATUS_OPTS.map(s => (
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
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
            {s !== "all" && counts[s] ? ` (${counts[s]})` : ""}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <UserCheck className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">No {filter === "all" ? "" : filter} applications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(app => {
            const { phone, city } = parseBio(app.bio);
            const shortId = app.user_id.slice(0, 8) + "…";
            const dateStr = new Date(app.created_at).toLocaleDateString("en-NG", {
              day: "numeric", month: "short", year: "numeric",
            });
            const isUpdating = updating[app.id];

            return (
              <div
                key={app.id}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/20 shrink-0">
                        <UserCheck className="h-4 w-4 text-brand-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {phone ? `+234 ${phone.replace(/^0/, "")}` : `User ${shortId}`}
                        </p>
                        <p className="text-xs text-zinc-500">ID: {shortId}</p>
                      </div>
                      <span className={cn(
                        "ml-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        STATUS_STYLE[app.status] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                      )}>
                        {app.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {[
                        { label: "City",     value: city ?? app.city ?? "—" },
                        { label: "Vehicle",  value: app.vehicle_type ?? "—" },
                        { label: "Applied",  value: dateStr },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-xl bg-zinc-800/60 px-3 py-2">
                          <p className="text-xs text-zinc-500">{label}</p>
                          <p className="text-sm font-medium text-zinc-200 mt-0.5 capitalize">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {(app.status === "pending" || app.status === "in_review") && (
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => updateStatus(app.id, "approved")}
                      disabled={isUpdating}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500/20 border border-green-500/30 px-4 py-2.5 text-sm font-semibold text-green-400 hover:bg-green-500/30 transition disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Approve
                    </button>
                    {app.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(app.id, "in_review")}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 px-4 py-2.5 text-sm font-semibold text-blue-400 hover:bg-blue-500/30 transition disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                        Mark In Review
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => updateStatus(app.id, "rejected")}
                      disabled={isUpdating}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      Reject
                    </button>
                  </div>
                )}

                {app.status === "approved" && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    <p className="text-xs font-medium text-green-300">Approved — runner can accept tasks</p>
                    <button
                      type="button"
                      onClick={() => updateStatus(app.id, "rejected")}
                      disabled={isUpdating}
                      className="ml-auto text-xs text-zinc-500 hover:text-red-400 transition"
                    >
                      Revoke
                    </button>
                  </div>
                )}

                {app.status === "rejected" && (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(app.id, "approved")}
                      disabled={isUpdating}
                      className="text-xs text-zinc-500 hover:text-green-400 transition underline"
                    >
                      Re-approve this runner
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
