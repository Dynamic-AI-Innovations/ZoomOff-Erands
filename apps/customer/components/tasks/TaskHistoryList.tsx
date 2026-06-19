"use client";

import * as React from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { tasksApi } from "@zoomoff/api-client";
import { Badge, Card, SkeletonCard, Button } from "@zoomoff/ui";
import type { Task, TaskStatus } from "@zoomoff/api-client";
import { MapPin, Clock, ArrowRight } from "lucide-react";

const STATUS_BADGE: Record<TaskStatus, { label: string; variant: "success" | "info" | "warning" | "error" | "muted" | "default" }> = {
  posted: { label: "Posted", variant: "info" },
  assigned: { label: "Runner Assigned", variant: "info" },
  en_route: { label: "En Route", variant: "warning" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "muted" },
  disputed: { label: "Disputed", variant: "error" },
};

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
}

export function TaskHistoryList() {
  const [statusFilter, setStatusFilter] = React.useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["tasks", statusFilter],
    queryFn: ({ pageParam = 1 }) =>
      tasksApi.list({ page: pageParam as number, pageSize: 12, status: statusFilter || undefined }),
    getNextPageParam: (last, all) =>
      last.meta.total > all.length * 12 ? all.length + 1 : undefined,
    initialPageParam: 1,
  });

  const tasks = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? "bg-brand-charcoal text-white"
                : "bg-white border border-zo-border text-zo-muted hover:border-brand-charcoal"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!isLoading && tasks.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-sm font-semibold text-brand-charcoal">No errands found</p>
          <p className="text-xs text-zo-muted mt-1">
            {statusFilter ? `No ${statusFilter} errands yet` : "Request your first errand to get started"}
          </p>
          <Button variant="primary" size="sm" className="mt-4" asChild>
            <Link href="/post-errand">Request an Errand</Link>
          </Button>
        </Card>
      )}

      <div className="space-y-3">
        {tasks.map((task: Task) => {
          const badge = STATUS_BADGE[task.status];
          const isActive = ["posted", "assigned", "en_route", "in_progress"].includes(task.status);
          return (
            <Link key={task.id} href={isActive ? `/tasks/${task.id}/track` : `/tasks/${task.id}`}>
              <Card hover className="transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant={badge.variant} dot>{badge.label}</Badge>
                      {task.isUrgent && <Badge variant="warning">Urgent</Badge>}
                    </div>
                    <p className="font-semibold text-brand-charcoal capitalize">
                      {task.category.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-zo-muted mt-0.5 truncate">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zo-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        {task.pickup.address.split(",")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {formatDate(task.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-display text-lg font-bold text-brand-charcoal">{formatNaira(task.price)}</span>
                    <ArrowRight className="h-4 w-4 text-zo-muted" aria-hidden="true" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {hasNextPage && (
        <div className="text-center pt-2">
          <Button variant="outline" onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
