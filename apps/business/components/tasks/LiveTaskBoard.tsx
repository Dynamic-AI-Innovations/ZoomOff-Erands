"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Card, Badge, Button, Skeleton } from "@zoomoff/ui";
import { PlusCircle, Clock, CheckCircle2, AlertTriangle, Loader } from "lucide-react";
import Link from "next/link";
import type { Task, TaskStatus } from "@zoomoff/api-client";

const COLUMNS: { key: TaskStatus | "pending_approval"; label: string; icon: React.ElementType; color: string }[] = [
  { key: "pending_approval", label: "Pending Approval", icon: Clock, color: "text-zo-warning" },
  { key: "posted", label: "Awaiting Runner", icon: Loader, color: "text-zo-info" },
  { key: "in_progress", label: "In Progress", icon: Loader, color: "text-brand-gold" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "text-zo-success" },
  { key: "disputed", label: "Disputed", icon: AlertTriangle, color: "text-zo-error" },
];

function formatNaira(n: number) { return `₦${n.toLocaleString("en-NG")}`; }

export function LiveTaskBoard() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["business-tasks"],
    queryFn: () => apiClient.get<{ data: Task[] }>("/business/tasks").then(r => r.data.data),
    refetchInterval: 15000,
  });

  const tasksByColumn = React.useMemo(() => {
    const map: Record<string, Task[]> = {};
    COLUMNS.forEach(c => { map[c.key] = []; });
    (tasks ?? []).forEach(t => {
      const col = (t as Task & { pendingApproval?: boolean }).pendingApproval ? "pending_approval" : t.status;
      if (map[col]) map[col].push(t);
    });
    return map;
  }, [tasks]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="primary" size="sm" asChild>
          <Link href="/tasks/new"><PlusCircle className="h-4 w-4" /> Post Task</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/tasks/bulk-upload">Bulk Upload CSV</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {COLUMNS.map(c => <Skeleton key={c.key} height={200} className="rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {COLUMNS.map(({ key, label, icon: Icon, color }) => {
            const colTasks = tasksByColumn[key] ?? [];
            return (
              <div key={key} className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
                  <span className="text-xs font-semibold text-brand-charcoal uppercase tracking-wide">{label}</span>
                  <span className="ml-auto text-xs font-bold text-zo-muted">{colTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {colTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-zo-border p-4 text-center">
                      <p className="text-xs text-zo-muted">None</p>
                    </div>
                  )}
                  {colTasks.map(task => (
                    <Link key={task.id} href={`/tasks/${task.id}`}>
                      <Card hover padding="sm" className="space-y-2">
                        <p className="text-xs font-semibold text-brand-charcoal capitalize truncate">
                          {task.category.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-zo-muted truncate">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-charcoal">{formatNaira(task.price)}</span>
                          {key === "pending_approval" && (
                            <Button variant="primary" size="sm" className="text-2xs h-6 px-2">Approve</Button>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
