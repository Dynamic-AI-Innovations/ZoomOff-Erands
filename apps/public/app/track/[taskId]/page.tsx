"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, LogOut, MapPin, Clock, CheckCircle2,
  Package, User, AlertTriangle, Loader2,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Task = {
  id: string;
  category: string;
  description: string;
  status: string;
  pickup_address: string;
  destination_address: string | null;
  notes: string | null;
  schedule_type: string;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  posted:      "Finding Runner",
  assigned:    "Runner Assigned",
  en_route:    "Runner En Route",
  in_progress: "In Progress",
  completed:   "Completed",
  cancelled:   "Cancelled",
  disputed:    "Disputed",
};

const STATUS_COLOR: Record<string, string> = {
  posted:      "text-amber-700 bg-amber-50 border-amber-200",
  assigned:    "text-blue-700 bg-blue-50 border-blue-200",
  en_route:    "text-blue-700 bg-blue-50 border-blue-200",
  in_progress: "text-orange-700 bg-orange-50 border-orange-200",
  completed:   "text-green-700 bg-green-50 border-green-200",
  cancelled:   "text-gray-500 bg-gray-50 border-gray-200",
  disputed:    "text-red-700 bg-red-50 border-red-200",
};

const TIMELINE_STEPS = [
  { key: "posted",      label: "Errand Posted",       desc: "Looking for an available runner" },
  { key: "assigned",    label: "Runner Assigned",      desc: "A verified runner has accepted your errand" },
  { key: "en_route",   label: "Runner En Route",      desc: "Your runner is heading to the pickup location" },
  { key: "in_progress", label: "Errand In Progress",  desc: "Your runner is completing the errand" },
  { key: "completed",   label: "Errand Completed",    desc: "Your errand has been completed" },
];

const STATUS_ORDER = ["posted", "assigned", "en_route", "in_progress", "completed"];

function getStepState(stepKey: string, currentStatus: string): "done" | "current" | "pending" {
  if (currentStatus === "cancelled" || currentStatus === "disputed") return "pending";
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  const stepIdx = STATUS_ORDER.indexOf(stepKey);
  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "current";
  return "pending";
}

export default function TrackPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.taskId as string;

  const [task, setTask] = React.useState<Task | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (!taskId) return;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setTask(data);
      setLoading(false);
    });
  }, [taskId, router]);

  // Real-time subscription
  React.useEffect(() => {
    if (!taskId) return;
    const channel = supabase
      .channel(`task-track-${taskId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tasks", filter: `id=eq.${taskId}` },
        (payload) => { setTask(prev => prev ? { ...prev, ...(payload.new as Task) } : prev); }
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [taskId]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zo-bg-light flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !task) {
    return (
      <div className="min-h-screen bg-zo-bg-light flex flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="font-display text-xl font-bold text-brand-charcoal mb-2">Errand not found</h1>
        <p className="text-sm text-zo-muted mb-6">This errand doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Button variant="primary" size="md" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const createdDate = new Date(task.created_at).toLocaleDateString("en-NG", {
    day: "numeric", month: "long", year: "numeric",
  });
  const createdTime = new Date(task.created_at).toLocaleTimeString("en-NG", {
    hour: "2-digit", minute: "2-digit",
  });

  const isCancelled = task.status === "cancelled";
  const isDisputed = task.status === "disputed";
  const isCompleted = task.status === "completed";

  return (
    <div className="min-h-screen bg-zo-bg-light">
      {/* Header */}
      <header className="bg-white border-b border-zo-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Back link */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Title + status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-extrabold text-brand-charcoal">{task.category}</h1>
            <p className="text-xs text-zo-muted mt-0.5">Requested {createdDate} at {createdTime}</p>
          </div>
          <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLOR[task.status] ?? "text-gray-600 bg-gray-50 border-gray-200"}`}>
            {STATUS_LABEL[task.status] ?? task.status}
          </span>
        </div>

        {/* Errand details card */}
        <div className="rounded-2xl bg-white border border-zo-border p-5 space-y-4">
          <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">Errand Details</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10">
                <Package className="h-4 w-4 text-brand-gold" />
              </div>
              <div>
                <p className="text-xs text-zo-muted">Description</p>
                <p className="text-sm text-brand-charcoal font-medium mt-0.5">{task.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-50">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-zo-muted">Pickup location</p>
                <p className="text-sm text-brand-charcoal font-medium mt-0.5">{task.pickup_address}</p>
              </div>
            </div>

            {task.destination_address && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-zo-muted">Drop-off location</p>
                  <p className="text-sm text-brand-charcoal font-medium mt-0.5">{task.destination_address}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zo-bg-light">
                <Clock className="h-4 w-4 text-zo-muted" />
              </div>
              <div>
                <p className="text-xs text-zo-muted">Timing</p>
                <p className="text-sm text-brand-charcoal font-medium mt-0.5">
                  {task.schedule_type === "asap"
                    ? "As soon as possible"
                    : task.scheduled_at
                      ? new Date(task.scheduled_at).toLocaleString("en-NG")
                      : "Scheduled"}
                </p>
              </div>
            </div>

            {task.notes && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zo-bg-light">
                  <User className="h-4 w-4 text-zo-muted" />
                </div>
                <div>
                  <p className="text-xs text-zo-muted">Special instructions</p>
                  <p className="text-sm text-brand-charcoal font-medium mt-0.5">{task.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status timeline */}
        {!isCancelled && !isDisputed && (
          <div className="rounded-2xl bg-white border border-zo-border p-5">
            <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-5">Live Status</p>
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const state = getStepState(step.key, task.status);
                const isLast = idx === TIMELINE_STEPS.length - 1;
                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Line + dot */}
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        state === "done" ? "bg-green-500 border-green-500" :
                        state === "current" ? "bg-brand-gold border-brand-gold" :
                        "bg-white border-zo-border"
                      }`}>
                        {state === "done"
                          ? <CheckCircle2 className="h-4 w-4 text-white" />
                          : state === "current"
                            ? <Loader2 className="h-4 w-4 text-white animate-spin" />
                            : <div className="h-2 w-2 rounded-full bg-zo-border" />
                        }
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${state === "done" ? "bg-green-200" : "bg-zo-border"}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-5 pt-1 ${isLast ? "" : ""}`}>
                      <p className={`text-sm font-semibold ${state === "pending" ? "text-zo-muted" : "text-brand-charcoal"}`}>
                        {step.label}
                      </p>
                      {state === "current" && (
                        <p className="text-xs text-zo-muted mt-0.5">{step.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled / Disputed state */}
        {(isCancelled || isDisputed) && (
          <div className={`rounded-2xl border p-5 flex items-start gap-4 ${
            isDisputed ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
          }`}>
            <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${isDisputed ? "text-red-500" : "text-gray-400"}`} />
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">
                {isDisputed ? "Errand disputed" : "Errand cancelled"}
              </p>
              <p className="text-xs text-zo-muted mt-0.5">
                {isDisputed
                  ? "A dispute has been raised on this errand. Our team will review and contact you."
                  : "This errand has been cancelled."}
              </p>
            </div>
          </div>
        )}

        {/* Completed CTA */}
        {isCompleted && (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-brand-charcoal text-sm">Errand completed!</p>
            <p className="text-xs text-zo-muted mt-1 mb-3">Thank you for using ZoomOff Errands.</p>
            <Button variant="primary" size="sm" asChild>
              <Link href="/delegate">Request another errand</Link>
            </Button>
          </div>
        )}

        {/* Back button */}
        {!isCompleted && (
          <Button variant="outline" size="md" className="w-full" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        )}

        <p className="text-center text-2xs text-zo-muted/60 pb-4">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
