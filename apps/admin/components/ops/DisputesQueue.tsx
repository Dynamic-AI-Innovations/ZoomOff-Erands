"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Badge, Card, Button } from "@zoomoff/ui";
import { AlertTriangle, Clock, DollarSign } from "lucide-react";

interface Dispute {
  id: string;
  taskId: string;
  reason: string;
  status: "open" | "under_review" | "escalated" | "resolved";
  taskAmount: number;
  customerName: string;
  runnerName: string;
  slaHoursLeft: number;
  filedAt: string;
}

function formatNaira(n: number) { return `₦${n.toLocaleString("en-NG")}`; }
function formatAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export function DisputesQueue() {
  const { data: disputes, isLoading } = useQuery({
    queryKey: ["admin-disputes"],
    queryFn: () => apiClient.get<{ data: Dispute[] }>("/admin/disputes?status=open,under_review,escalated").then(r => r.data.data),
    refetchInterval: 30000,
  });

  const all = disputes ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dispute Queue</h1>
          <p className="text-sm text-gray-400 mt-1">SLA: 48 hours per dispute · sorted oldest first</p>
        </div>
        <Badge variant={all.length > 0 ? "warning" : "success"} dot>{all.length} open</Badge>
      </div>

      {isLoading && <div className="text-gray-400 text-sm">Loading disputes...</div>}

      {!isLoading && all.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <AlertTriangle className="h-10 w-10 text-zo-border mx-auto mb-3" aria-hidden="true" />
          <p className="text-white font-semibold">No open disputes</p>
        </div>
      )}

      <div className="space-y-2">
        {all.map(d => (
          <div key={d.id} className={`rounded-xl border p-4 flex items-start gap-4 ${d.slaHoursLeft < 12 ? "border-zo-error/40 bg-zo-error/10" : d.status === "escalated" ? "border-zo-warning/40 bg-zo-warning/10" : "border-white/10 bg-white/5"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant={d.status === "escalated" ? "warning" : d.status === "under_review" ? "info" : "muted"}>
                  {d.status.replace(/_/g, " ")}
                </Badge>
                {d.slaHoursLeft < 12 && <Badge variant="error" dot>SLA {d.slaHoursLeft}h left</Badge>}
              </div>
              <p className="text-sm font-semibold text-white capitalize">{d.reason.replace(/_/g, " ")}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {d.customerName} vs {d.runnerName} · Filed {formatAgo(d.filedAt)}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-xs text-gray-500">Task value</p>
                <p className="font-bold text-white">{formatNaira(d.taskAmount)}</p>
              </div>
              <Button variant="primary" size="sm" asChild>
                <Link href={`/disputes/${d.id}`}>Review</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
