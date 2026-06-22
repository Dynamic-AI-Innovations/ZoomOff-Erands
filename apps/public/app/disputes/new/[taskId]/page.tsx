"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, LogOut, AlertTriangle, Loader2, CheckCircle2,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

const DISPUTE_REASONS = [
  "Runner did not show up",
  "Item was damaged or lost",
  "Errand was not completed as requested",
  "Runner was late beyond acceptable wait time",
  "Unprofessional behaviour",
  "Overcharged or billing issue",
  "Runner requested extra payment outside app",
  "Other",
];

export default function DisputePage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.taskId as string;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [taskCategory, setTaskCategory] = React.useState("");
  const [userId, setUserId] = React.useState("");

  React.useEffect(() => {
    if (!taskId) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUserId(session.user.id);

      const { data } = await supabase
        .from("tasks")
        .select("category, status")
        .eq("id", taskId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!data) { router.replace("/errands"); return; }
      setTaskCategory(data.category);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [taskId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) { setError("Please select a reason for your dispute."); return; }
    if (description.trim().length < 20) {
      setError("Please provide at least 20 characters describing what happened.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const { error: err } = await supabase.from("disputes").insert({
      task_id: taskId,
      filed_by: userId,
      reason,
      description: description.trim(),
    });

    if (err) {
      if (err.code === "42P01") {
        setError("The disputes system is being set up. Please contact support@zoomoff.africa directly.");
      } else {
        setError("Failed to submit dispute. Please try again or email support@zoomoff.africa.");
      }
    } else {
      setDone(true);
    }
    setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-zo-bg-light">
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
        <Link href={`/track/${taskId}`} className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Errand
        </Link>

        <div>
          <h1 className="font-display text-xl font-extrabold text-brand-charcoal">File a Dispute</h1>
          <p className="text-xs text-zo-muted mt-1">
            Errand: <span className="font-semibold text-brand-charcoal">{taskCategory}</span>
          </p>
        </div>

        {done ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="font-bold text-brand-charcoal text-base mb-1">Dispute submitted</p>
            <p className="text-sm text-zo-muted mb-5 leading-relaxed">
              Our support team will review your case and reach out within 24 hours via email.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="primary" size="md" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button variant="outline" size="md" asChild>
                <Link href="/errands">View My Errands</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Disputes are reviewed within 24 hours. Please provide accurate, honest information.
                False or malicious disputes may result in account suspension.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-zo-border p-5 space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                  Reason for dispute <span className="text-zo-error">*</span>
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-zo-border bg-white px-4 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition appearance-none"
                >
                  <option value="">Select a reason…</option>
                  {DISPUTE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                  What happened? <span className="text-zo-error">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail. Include what was expected, what happened, and any relevant times or amounts…"
                  rows={6}
                  required
                  className="w-full rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition resize-none"
                />
                <p className={`text-xs mt-1 ${description.trim().length >= 20 ? "text-green-600" : "text-zo-muted"}`}>
                  {description.trim().length} characters {description.trim().length < 20 ? `(${20 - description.trim().length} more needed)` : ""}
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={submitting}
              >
                {submitting
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</>
                  : "Submit Dispute"
                }
              </Button>
            </form>

            <p className="text-center text-xs text-zo-muted">
              Urgent issue? Email us directly at{" "}
              <a href="mailto:support@zoomoff.africa" className="text-brand-gold hover:underline font-medium">
                support@zoomoff.africa
              </a>
            </p>
          </>
        )}

        <p className="text-center text-2xs text-zo-muted/60 pb-4">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
