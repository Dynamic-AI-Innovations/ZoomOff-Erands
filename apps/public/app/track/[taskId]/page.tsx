"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, LogOut, MapPin, Clock, CheckCircle2,
  Package, User, AlertTriangle, Loader2, Star, XCircle,
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
  runner_id: string | null;
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
  { key: "posted",      label: "Errand Posted",      desc: "Looking for an available runner" },
  { key: "assigned",    label: "Runner Assigned",     desc: "A verified runner has accepted your errand" },
  { key: "en_route",    label: "Runner En Route",     desc: "Your runner is heading to the pickup location" },
  { key: "in_progress", label: "Errand In Progress",  desc: "Your runner is completing the errand" },
  { key: "completed",   label: "Errand Completed",    desc: "Your errand has been completed successfully" },
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
  const [userId, setUserId] = React.useState("");

  // Cancel
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [cancelLoading, setCancelLoading] = React.useState(false);
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  // Rating
  const [hasRated, setHasRated] = React.useState(false);
  const [ratingScore, setRatingScore] = React.useState(0);
  const [hoverScore, setHoverScore] = React.useState(0);
  const [ratingReview, setRatingReview] = React.useState("");
  const [ratingSubmitting, setRatingSubmitting] = React.useState(false);
  const [ratingDone, setRatingDone] = React.useState(false);

  React.useEffect(() => {
    if (!taskId) return;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUserId(session.user.id);

      const [taskRes, ratingRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("id", taskId).eq("user_id", session.user.id).maybeSingle(),
        supabase.from("ratings").select("id").eq("task_id", taskId).eq("rater_id", session.user.id).maybeSingle().catch(() => ({ data: null })),
      ]);

      if (taskRes.error || !taskRes.data) { setNotFound(true); setLoading(false); return; }
      setTask(taskRes.data as Task);
      setHasRated(!!(ratingRes as { data: unknown }).data);
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

  async function handleCancel() {
    if (!task) return;
    setCancelLoading(true);
    setCancelError(null);
    const { error } = await supabase
      .from("tasks")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", task.id)
      .eq("user_id", userId);
    if (error) {
      setCancelError("Failed to cancel. Please try again or contact support.");
    } else {
      setTask(prev => prev ? { ...prev, status: "cancelled" } : prev);
      setShowCancelConfirm(false);
    }
    setCancelLoading(false);
  }

  async function handleRating() {
    if (!task || ratingScore === 0 || !userId) return;
    setRatingSubmitting(true);
    const { error } = await supabase.from("ratings").insert({
      task_id: task.id,
      rater_id: userId,
      rated_id: task.runner_id ?? null,
      score: ratingScore,
      review: ratingReview.trim() || null,
    });
    if (!error) {
      setRatingDone(true);
      setHasRated(true);
    }
    setRatingSubmitting(false);
  }

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
  const isDisputed  = task.status === "disputed";
  const isCompleted = task.status === "completed";
  const isPosted    = task.status === "posted";

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

        {/* Cancel errand — only when posted (no runner yet) */}
        {isPosted && !showCancelConfirm && (
          <button
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-zo-error hover:bg-red-100 transition-colors"
          >
            <XCircle className="h-4 w-4" /> Cancel this errand
          </button>
        )}

        {showCancelConfirm && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-brand-charcoal text-sm mb-1">Cancel this errand?</p>
            <p className="text-xs text-zo-muted mb-4 leading-relaxed">
              This cannot be undone. The errand will be cancelled and removed from the runner queue.
            </p>
            {cancelError && (
              <p className="text-xs text-zo-error mb-3">{cancelError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zo-error py-2.5 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-60"
              >
                {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, cancel it"}
              </button>
              <button
                type="button"
                onClick={() => { setShowCancelConfirm(false); setCancelError(null); }}
                className="flex flex-1 items-center justify-center rounded-xl border border-zo-border bg-white py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-zo-bg-light transition"
              >
                Keep errand
              </button>
            </div>
          </div>
        )}

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
                    <div className="pb-5 pt-1">
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

        {/* Cancelled / Disputed banner */}
        {(isCancelled || isDisputed) && (
          <div className={`rounded-2xl border p-5 flex items-start gap-4 ${
            isDisputed ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
          }`}>
            <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${isDisputed ? "text-red-500" : "text-gray-400"}`} />
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">
                {isDisputed ? "Errand disputed" : "Errand cancelled"}
              </p>
              <p className="text-xs text-zo-muted mt-0.5 leading-relaxed">
                {isDisputed
                  ? "A dispute has been raised on this errand. Our team will review and contact you within 24 hours."
                  : "This errand has been cancelled. You can request a new errand at any time."}
              </p>
            </div>
          </div>
        )}

        {/* Completed celebration */}
        {isCompleted && (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
            <p className="font-bold text-brand-charcoal">Errand completed!</p>
            <p className="text-xs text-zo-muted mt-1 mb-4">Thank you for using ZoomOff Errands.</p>
            <Button variant="primary" size="sm" asChild>
              <Link href="/delegate">Request another errand</Link>
            </Button>
          </div>
        )}

        {/* Rate your runner — show after completion, once */}
        {isCompleted && !hasRated && !ratingDone && (
          <div className="rounded-2xl bg-white border border-zo-border p-5">
            <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-1">Rate Your Runner</p>
            <p className="text-sm text-zo-muted mb-4">How was your experience? Your rating helps maintain high standards.</p>

            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverScore(s)}
                  onMouseLeave={() => setHoverScore(0)}
                  onClick={() => setRatingScore(s)}
                  aria-label={`Rate ${s} star${s !== 1 ? "s" : ""}`}
                  className="p-1.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
                >
                  <Star
                    className={`h-9 w-9 transition-colors ${
                      s <= (hoverScore || ratingScore)
                        ? "fill-brand-gold text-brand-gold"
                        : "text-zo-border"
                    }`}
                  />
                </button>
              ))}
            </div>

            {ratingScore > 0 && (
              <>
                <textarea
                  value={ratingReview}
                  onChange={e => setRatingReview(e.target.value)}
                  placeholder="Leave a review for your runner (optional)…"
                  rows={3}
                  className="w-full rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition resize-none mb-3"
                />
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleRating}
                  disabled={ratingSubmitting}
                >
                  {ratingSubmitting
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</>
                    : `Submit ${ratingScore}-Star Rating`
                  }
                </Button>
              </>
            )}
          </div>
        )}

        {/* Rating thank-you */}
        {(ratingDone || (isCompleted && hasRated)) && (
          <div className="rounded-2xl bg-green-50 border border-green-200 px-5 py-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <p className="text-sm font-medium text-brand-charcoal">Thanks for your rating!</p>
          </div>
        )}

        {/* Dispute link */}
        {(isCompleted || isCancelled || isDisputed) && !isDisputed && (
          <div className="text-center">
            <Link
              href={`/disputes/new/${task.id}`}
              className="text-xs text-zo-muted hover:text-zo-error transition-colors underline underline-offset-2"
            >
              Something went wrong? File a dispute →
            </Link>
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
