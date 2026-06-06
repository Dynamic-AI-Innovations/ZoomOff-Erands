"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@zoomoff/api-client";
import { Card, Badge, Button, Modal, useToast, Skeleton } from "@zoomoff/ui";
import { MapPin, Clock, DollarSign, ChevronDown, Navigation } from "lucide-react";

interface RunnerTask {
  id: string;
  category: string;
  description: string;
  distanceKm: number;
  estimatedPay: number;
  priceBreakdown: { baseRate: number; distanceFee: number; complexityFee: number; total: number };
  scheduleType: string;
  scheduledAt: string | null;
  complexity: "low" | "medium" | "high";
  customerRating: number;
  estimatedDuration: string;
  pickup: { address: string };
  destination: { address: string };
}

function formatNaira(n: number) { return `₦${n.toLocaleString("en-NG")}`; }

function ComplexityDot({ level }: { level: string }) {
  const colors = { low: "bg-zo-success", medium: "bg-brand-gold", high: "bg-zo-error" };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[level as keyof typeof colors] ?? "bg-zo-muted"}`} aria-hidden="true" />;
}

export function TaskFeed() {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = React.useState<RunnerTask | null>(null);
  const [countdown, setCountdown] = React.useState(45);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["runner-task-feed"],
    queryFn: () => apiClient.get<{ data: RunnerTask[] }>("/runner/tasks/feed").then(r => r.data.data),
    refetchInterval: 10000,
  });

  // 45-second countdown when a task is selected
  React.useEffect(() => {
    if (!selected) { setCountdown(45); return; }
    const t = setInterval(() => setCountdown(c => {
      if (c <= 1) { setSelected(null); return 45; }
      return c - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [selected]);

  const { mutate: accept, isPending: accepting } = useMutation({
    mutationFn: (taskId: string) => apiClient.post(`/tasks/${taskId}/accept`),
    onSuccess: (_, taskId) => {
      setSelected(null);
      qc.invalidateQueries({ queryKey: ["runner-task-feed"] });
      toast({ type: "success", title: "Task accepted!", description: "Navigate to pickup location." });
      router.push(`/tasks/active`);
    },
    onError: () => toast({ type: "error", title: "Could not accept task", description: "It may have been taken." }),
  });

  const { mutate: decline } = useMutation({
    mutationFn: (taskId: string) => apiClient.post(`/tasks/${taskId}/decline`),
    onSuccess: () => { setSelected(null); qc.invalidateQueries({ queryKey: ["runner-task-feed"] }); },
  });

  if (isLoading) return (
    <div className="space-y-3 max-w-lg mx-auto p-4">
      {[1,2,3].map(i => <Skeleton key={i} height={100} className="rounded-2xl" />)}
    </div>
  );

  const taskList = tasks ?? [];

  return (
    <div className="max-w-lg mx-auto p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-brand-charcoal">Available Tasks</h1>
        <Badge variant={taskList.length > 0 ? "success" : "muted"} dot>
          {taskList.length} nearby
        </Badge>
      </div>

      {taskList.length === 0 && (
        <Card className="text-center py-12">
          <Clock className="h-10 w-10 text-zo-border mx-auto mb-3" aria-hidden="true" />
          <p className="font-semibold text-brand-charcoal">No tasks in your area</p>
          <p className="text-xs text-zo-muted mt-1">Feed refreshes every 10 seconds. Try a different zone.</p>
        </Card>
      )}

      {taskList.map((task) => (
        <button
          key={task.id}
          onClick={() => setSelected(task)}
          className="w-full text-left"
        >
          <Card hover className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-charcoal capitalize">{task.category.replace(/_/g, " ")}</p>
                <p className="text-xs text-zo-muted mt-0.5 truncate">{task.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-lg font-bold text-brand-charcoal">{formatNaira(task.estimatedPay)}</p>
                <p className="text-xs text-zo-muted">{task.estimatedDuration}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-zo-muted">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
                {task.distanceKm.toFixed(1)} km away
              </span>
              <span className="flex items-center gap-1">
                <ComplexityDot level={task.complexity} />
                {task.complexity} complexity
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {task.scheduleType === "instant" ? "ASAP" : task.scheduledAt ?? "Today"}
              </span>
            </div>
          </Card>
        </button>
      ))}

      {/* Task preview modal */}
      <Modal open={!!selected} onOpenChange={() => setSelected(null)} title="Task Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-brand-charcoal capitalize">
                {selected.category.replace(/_/g, " ")}
              </h3>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-base font-bold ${countdown <= 10 ? "bg-zo-error text-white" : "bg-brand-gold text-brand-charcoal"}`}>
                {countdown}
              </div>
            </div>

            <p className="text-sm text-zo-muted leading-relaxed">{selected.description}</p>

            <Card className="bg-zo-bg-light border-0 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-zo-muted">Pickup</p>
                  <p className="text-sm font-medium text-brand-charcoal">{selected.pickup.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Navigation className="h-4 w-4 text-zo-info mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-zo-muted">Destination</p>
                  <p className="text-sm font-medium text-brand-charcoal">{selected.destination.address}</p>
                </div>
              </div>
            </Card>

            {/* Price breakdown */}
            <Card>
              <div className="divide-y divide-zo-border text-sm">
                {[
                  { l: "Base Rate", v: selected.priceBreakdown.baseRate },
                  { l: "Distance Fee", v: selected.priceBreakdown.distanceFee },
                  { l: "Complexity", v: selected.priceBreakdown.complexityFee },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between py-2">
                    <span className="text-zo-muted">{l}</span>
                    <span className="font-medium text-brand-charcoal">{formatNaira(v)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-3 mt-1 border-t-2 border-brand-gold">
                <span className="font-bold text-brand-charcoal">Your Payout</span>
                <span className="font-display text-xl font-bold text-brand-charcoal">{formatNaira(selected.estimatedPay)}</span>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => { decline(selected.id); }}>
                Decline
              </Button>
              <Button variant="primary" size="lg" className="flex-1" loading={accepting} onClick={() => accept(selected.id)}>
                Accept ({countdown}s)
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
