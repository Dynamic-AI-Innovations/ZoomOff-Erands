"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Badge, Button, Card } from "@zoomoff/ui";
import { AlertTriangle, CheckCircle2, Clock, CreditCard, Flag, Zap } from "lucide-react";

type AlertType = "unassigned_task" | "disputed_task" | "failed_payment" | "flagged_runner" | "system_error";
interface Alert { id: string; type: AlertType; title: string; description: string; severity: "critical" | "high" | "medium"; taskId?: string; userId?: string; createdAt: string; }

const ALERT_ICONS: Record<AlertType, React.ElementType> = {
  unassigned_task: Clock,
  disputed_task: AlertTriangle,
  failed_payment: CreditCard,
  flagged_runner: Flag,
  system_error: Zap,
};

function formatAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export function AlertsCenter() {
  const qc = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["admin-alerts"],
    queryFn: () => apiClient.get<{ data: Alert[] }>("/admin/alerts").then(r => r.data.data),
    refetchInterval: 15000,
  });

  const { mutate: dismiss } = useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/alerts/${id}/dismiss`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-alerts"] }),
  });

  const allAlerts = alerts ?? [];
  const critical = allAlerts.filter(a => a.severity === "critical");
  const others = allAlerts.filter(a => a.severity !== "critical");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Alert Centre</h1>
        <Badge variant={allAlerts.length > 0 ? "error" : "success"} dot>
          {allAlerts.length} active
        </Badge>
      </div>

      {isLoading && <div className="text-gray-400 text-sm">Loading alerts...</div>}

      {!isLoading && allAlerts.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-zo-success mx-auto mb-3" aria-hidden="true" />
          <p className="text-white font-semibold">All clear — no active alerts</p>
        </div>
      )}

      {critical.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zo-error uppercase tracking-wide mb-2">Critical</h2>
          <div className="space-y-2">
            {critical.map(alert => <AlertCard key={alert.id} alert={alert} onDismiss={() => dismiss(alert.id)} />)}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Other Alerts</h2>
          <div className="space-y-2">
            {others.map(alert => <AlertCard key={alert.id} alert={alert} onDismiss={() => dismiss(alert.id)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss: () => void }) {
  const Icon = ALERT_ICONS[alert.type];
  const borderColor = alert.severity === "critical" ? "border-zo-error/50" : alert.severity === "high" ? "border-zo-warning/50" : "border-white/10";

  return (
    <div className={`flex items-start gap-3 rounded-xl border ${borderColor} bg-white/5 p-4`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${alert.severity === "critical" ? "bg-zo-error/20 text-zo-error" : "bg-white/10 text-gray-300"}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{alert.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{alert.description}</p>
        <p className="text-xs text-gray-600 mt-1">{formatAgo(alert.createdAt)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {alert.taskId && (
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs" asChild>
            <a href={`/tasks/${alert.taskId}`}>View Task</a>
          </Button>
        )}
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white text-xs" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
