"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { tasksApi } from "@zoomoff/api-client";
import { Button, Card, Badge, Avatar, useToast, cn } from "@zoomoff/ui";
import { MapPin, MessageCircle, Phone, AlertOctagon, Star, CheckCircle2, Clock } from "lucide-react";
import type { Task, TaskStatus } from "@zoomoff/api-client";
import { TaskChat } from "./TaskChat";
import { RatingModal } from "./RatingModal";
import { SOSModal } from "./SOSModal";
import { useTaskRealtime } from "../../hooks/useTaskRealtime";

const STATUS_STEPS: { key: TaskStatus; label: string }[] = [
  { key: "posted", label: "Posted" },
  { key: "assigned", label: "Runner Assigned" },
  { key: "en_route", label: "En Route" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const STATUS_ORDER = ["posted", "assigned", "en_route", "in_progress", "completed"];

function getStepIndex(status: TaskStatus) {
  return STATUS_ORDER.indexOf(status);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Africa/Lagos" });
}

export function LiveTrackingView({ taskId }: { taskId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showChat, setShowChat] = React.useState(false);
  const [showRating, setShowRating] = React.useState(false);
  const [showSOS, setShowSOS] = React.useState(false);

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasksApi.getById(taskId),
    // Fallback poll at 30s — Supabase real-time is the primary update path
    refetchInterval: (q) => {
      const t = q.state.data;
      if (!t || ["completed", "cancelled", "disputed"].includes(t.status)) return false;
      return 30_000;
    },
  });

  // Real-time status updates via Supabase — fires instantly on any task UPDATE
  const handleRealtimeUpdate = React.useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["task", taskId] });
  }, [queryClient, taskId]);

  useTaskRealtime(taskId, handleRealtimeUpdate);

  const { mutate: confirmCompletion, isPending: confirming } = useMutation({
    mutationFn: () => tasksApi.confirm(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      setShowRating(true);
    },
    onError: () => toast({ type: "error", title: "Could not confirm completion" }),
  });

  if (isLoading || !task) {
    return <div className="text-center py-20 text-sm text-zo-muted">Loading errand details...</div>;
  }

  const stepIdx = getStepIndex(task.status);
  const isActive = !["completed", "cancelled", "disputed"].includes(task.status);
  const isCompleted = task.status === "completed";
  const isCancelled = task.status === "cancelled";

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-brand-charcoal capitalize">
            {task.category.replace(/_/g, " ")}
          </h1>
          <p className="text-xs text-zo-muted mt-0.5">#{task.id.slice(0, 8).toUpperCase()}</p>
        </div>
        {isActive && (
          <button
            onClick={() => setShowSOS(true)}
            className="flex items-center gap-1.5 rounded-xl bg-zo-error px-3 py-2 text-xs font-bold text-white hover:bg-red-700 animate-pulse-gold"
            aria-label="SOS — emergency help"
          >
            <AlertOctagon className="h-4 w-4" aria-hidden="true" /> SOS
          </button>
        )}
      </div>

      {/* Map placeholder — Google Maps JS API renders here */}
      <Card padding="none" className="h-56 bg-zo-bg-light flex items-center justify-center rounded-2xl overflow-hidden relative">
        <div className="text-center">
          <MapPin className="h-10 w-10 text-brand-gold mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-brand-charcoal">Live Map</p>
          <p className="text-xs text-zo-muted">Runner location updates every 5 seconds</p>
        </div>
        {task.runner && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-card">
            <Avatar name={task.runner.name} src={task.runner.photoUrl} size="sm" tier={task.runner.tier} />
            <div>
              <p className="text-xs font-semibold text-brand-charcoal">{task.runner.name}</p>
              <p className="text-xs text-zo-muted flex items-center gap-0.5">
                <Star className="h-3 w-3 text-brand-gold fill-brand-gold" aria-hidden="true" />
                {task.runner.rating.toFixed(1)}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* ETA */}
      {isActive && (
        <Card className="flex items-center justify-between bg-brand-gold/5 border-brand-gold/30">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-gold" aria-hidden="true" />
            <div>
              <p className="text-xs text-zo-muted">Estimated arrival</p>
              <p className="font-semibold text-brand-charcoal">Calculating...</p>
            </div>
          </div>
          <Badge variant="gold" dot>Live</Badge>
        </Card>
      )}

      {/* Status timeline */}
      <Card>
        <h2 className="font-semibold text-brand-charcoal mb-4">Status</h2>
        <ol className="space-y-3">
          {STATUS_STEPS.filter((s) => s.key !== "cancelled").map((step, i) => {
            const done = i <= stepIdx;
            const current = i === stepIdx;
            return (
              <li key={step.key} className="flex items-center gap-3">
                <div className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  done ? "border-brand-gold bg-brand-gold" : "border-zo-border bg-white"
                )}>
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 text-brand-charcoal" aria-hidden="true" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-zo-border" />
                  )}
                </div>
                <span className={cn(
                  "text-sm transition-colors",
                  current ? "font-bold text-brand-charcoal" : done ? "font-medium text-brand-charcoal" : "text-zo-muted"
                )}>
                  {step.label}
                  {current && isActive && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-gold animate-pulse" aria-hidden="true" />
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => setShowChat(true)}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat with Runner
        </Button>
        {task.runner && (
          <Button
            variant="outline"
            size="icon"
            aria-label="Call runner"
            asChild
          >
            <a href={`tel:${task.runner.phone}`}>
              <Phone className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        )}
      </div>

      {/* Confirm completion */}
      {task.status === "in_progress" && (
        <Card className="border-zo-success bg-zo-success-light">
          <p className="font-semibold text-zo-success mb-1">Runner submitted proof of completion</p>
          <p className="text-xs text-zo-muted mb-3">
            Confirm to release payment. Auto-releases in 2 hours if not confirmed.
          </p>
          <Button variant="primary" size="lg" className="w-full" loading={confirming} onClick={() => confirmCompletion()}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Confirm Completion & Release Payment
          </Button>
        </Card>
      )}

      {isCompleted && !showRating && (
        <Card className="text-center border-zo-success">
          <CheckCircle2 className="h-10 w-10 text-zo-success mx-auto mb-2" aria-hidden="true" />
          <p className="font-semibold text-brand-charcoal">Errand Completed!</p>
          <Button variant="primary" size="sm" className="mt-3" onClick={() => setShowRating(true)}>
            Rate Your Runner
          </Button>
        </Card>
      )}

      {isCancelled && (
        <Card className="text-center border-zo-error">
          <p className="font-semibold text-zo-error mb-1">Errand Cancelled</p>
          <Button variant="outline" size="sm" asChild>
            <a href={`/tasks/${taskId}/receipt`}>View Receipt</a>
          </Button>
        </Card>
      )}

      {/* Modals */}
      {showChat && <TaskChat taskId={taskId} onClose={() => setShowChat(false)} />}
      {showRating && task.runner && (
        <RatingModal
          taskId={taskId}
          runner={task.runner}
          onClose={() => { setShowRating(false); router.push("/tasks"); }}
        />
      )}
      {showSOS && <SOSModal taskId={taskId} onClose={() => setShowSOS(false)} />}
    </div>
  );
}
