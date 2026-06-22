"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, LogOut, Package, CheckCircle2, Clock, XCircle,
  TrendingUp, MapPin, Star, ChevronRight, Loader2, ArrowRight,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type RunnerApplication = {
  status: string;
  created_at: string;
  vehicle_type: string | null;
  city: string | null;
};

type Task = {
  id: string;
  category: string;
  status: string;
  pickup_address: string;
  destination_address: string | null;
  created_at: string;
  runner_id: string | null;
};

const STATUS_STEPS = [
  { key: "submitted", label: "Application Submitted", desc: "We have received your application." },
  { key: "in_review", label: "Under Review", desc: "Our team is reviewing your documents." },
  { key: "approved", label: "Approved", desc: "You are cleared to start accepting tasks." },
];

function ApplicationTimeline({ status }: { status: string }) {
  const order = ["pending", "in_review", "approved"];
  const currentIdx = order.indexOf(status);

  return (
    <div className="space-y-0">
      {STATUS_STEPS.map((step, idx) => {
        const stepStatus = idx < currentIdx ? "done"
          : idx === currentIdx ? "current"
          : "pending";
        const isLast = idx === STATUS_STEPS.length - 1;
        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                stepStatus === "done" ? "bg-green-500 border-green-500" :
                stepStatus === "current" ? "bg-brand-gold border-brand-gold" :
                "bg-white border-zo-border"
              )}>
                {stepStatus === "done"
                  ? <CheckCircle2 className="h-4 w-4 text-white" />
                  : stepStatus === "current"
                    ? <Loader2 className="h-4 w-4 text-white animate-spin" />
                    : <div className="h-2 w-2 rounded-full bg-zo-border" />
                }
              </div>
              {!isLast && (
                <div className={cn("w-0.5 flex-1 my-1 min-h-[24px]", stepStatus === "done" ? "bg-green-200" : "bg-zo-border")} />
              )}
            </div>
            <div className="pb-5 pt-1">
              <p className={cn("text-sm font-semibold", stepStatus === "pending" ? "text-zo-muted" : "text-brand-charcoal")}>
                {step.label}
              </p>
              {stepStatus === "current" && (
                <p className="text-xs text-zo-muted mt-0.5">{step.desc}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RunnerPortalPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [application, setApplication] = React.useState<RunnerApplication | null>(null);
  const [activeTasks, setActiveTasks] = React.useState<Task[]>([]);
  const [completedCount, setCompletedCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [noApplication, setNoApplication] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUser(session.user);

      const { data: app } = await supabase
        .from("runner_applications")
        .select("status, created_at, vehicle_type, city")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!app) { setNoApplication(true); setLoading(false); return; }
      setApplication(app);

      if (app.status === "approved") {
        const [activeRes, completedRes] = await Promise.all([
          supabase.from("tasks").select("id, category, status, pickup_address, destination_address, created_at, runner_id")
            .eq("runner_id", session.user.id)
            .in("status", ["assigned", "en_route", "in_progress"])
            .order("created_at", { ascending: false }),
          supabase.from("tasks").select("id", { count: "exact", head: true })
            .eq("runner_id", session.user.id)
            .eq("status", "completed"),
        ]);
        setActiveTasks(activeRes.data ?? []);
        setCompletedCount(completedRes.count ?? 0);
      }

      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

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

  const name = (user?.user_metadata?.name as string) ?? user?.email ?? "Runner";
  const firstName = name.split(" ")[0];

  // Not a runner applicant — prompt to apply
  if (noApplication) {
    return (
      <div className="min-h-screen bg-zo-bg-light">
        <header className="bg-white border-b border-zo-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/"><Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority /></Link>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gold/10 mx-auto">
            <Package className="h-10 w-10 text-brand-gold" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">Become a Runner</h1>
          <p className="text-sm text-zo-muted max-w-sm mx-auto leading-relaxed">
            You haven&apos;t applied to be a runner yet. Apply now to start earning by completing errands in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/runner-apply">Apply to be a Runner</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isApproved = application?.status === "approved";
  const isRejected = application?.status === "rejected";

  return (
    <div className="min-h-screen bg-zo-bg-light">
      <header className="bg-white border-b border-zo-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/"><Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority /></Link>
          <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">
            Runner Portal
          </h1>
          <p className="text-sm text-zo-muted mt-0.5">Hello, {firstName}</p>
        </div>

        {/* Status banner */}
        {!isApproved && !isRejected && (
          <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/5 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/20">
                <Clock className="h-5 w-5 text-brand-gold" />
              </div>
              <div>
                <p className="font-semibold text-brand-charcoal text-sm">Application Under Review</p>
                <p className="text-xs text-zo-muted">Usually reviewed within 2 hours</p>
              </div>
            </div>
            <ApplicationTimeline status={application?.status ?? "pending"} />
          </div>
        )}

        {isRejected && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-4">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">Application Not Approved</p>
              <p className="text-xs text-zo-muted mt-0.5 mb-3">
                Your runner application was not approved at this time. Contact our team for more details.
              </p>
              <a
                href="mailto:support@zoomoff.africa"
                className="text-xs font-semibold text-brand-gold hover:underline"
              >
                Contact support →
              </a>
            </div>
          </div>
        )}

        {/* Approved runner stats */}
        {isApproved && (
          <>
            <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 flex items-center gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
              <div>
                <p className="font-semibold text-brand-charcoal text-sm">Approved Runner</p>
                <p className="text-xs text-zo-muted">Your account is verified and active.</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white border border-zo-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-zo-muted font-medium">Completed</p>
                </div>
                <p className="font-display text-2xl font-extrabold text-brand-charcoal">{completedCount}</p>
                <p className="text-xs text-zo-muted">total errands</p>
              </div>
              <div className="rounded-2xl bg-white border border-zo-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-brand-gold" />
                  <p className="text-xs text-zo-muted font-medium">Rating</p>
                </div>
                <p className="font-display text-2xl font-extrabold text-brand-charcoal">—</p>
                <p className="text-xs text-zo-muted">pending ratings</p>
              </div>
            </div>

            {/* Active task */}
            {activeTasks.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  My Active Task
                </h2>
                {activeTasks.map(task => (
                  <Link
                    key={task.id}
                    href={`/runner/tasks/${task.id}`}
                    className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 hover:shadow-sm transition-all group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10">
                      <Package className="h-5 w-5 text-brand-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-charcoal">{task.category}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3 w-3 text-zo-muted shrink-0" />
                        <p className="text-xs text-zo-muted truncate">{task.pickup_address}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zo-muted group-hover:text-brand-charcoal transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/runner/tasks"
                className="flex flex-col items-center gap-2 rounded-2xl bg-brand-charcoal p-5 text-white hover:bg-brand-charcoal/90 transition-colors text-center">
                <Package className="h-6 w-6 text-brand-gold" />
                <p className="text-sm font-bold">Task Feed</p>
                <p className="text-xs text-gray-400">Browse & accept errands</p>
              </Link>
              <Link href="/runner/earnings"
                className="flex flex-col items-center gap-2 rounded-2xl bg-brand-charcoal p-5 text-white hover:bg-brand-charcoal/90 transition-colors text-center">
                <TrendingUp className="h-6 w-6 text-brand-gold" />
                <p className="text-sm font-bold">Earnings</p>
                <p className="text-xs text-gray-400">Track your income</p>
              </Link>
            </div>

            {/* Runner profile details */}
            {application && (
              <div className="rounded-2xl bg-white border border-zo-border p-5 space-y-3">
                <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">Runner Profile</p>
                {[
                  { label: "Vehicle Type", value: application.vehicle_type ?? "Not specified" },
                  { label: "Operating City", value: application.city ?? "Not specified" },
                  { label: "Application Date", value: new Date(application.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3">
                    <p className="text-xs text-zo-muted">{label}</p>
                    <p className="text-sm font-semibold text-brand-charcoal">{value}</p>
                  </div>
                ))}
                <Link
                  href="/profile"
                  className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors"
                >
                  <span>Edit profile</span>
                  <ArrowRight className="h-4 w-4 text-zo-muted" />
                </Link>
              </div>
            )}
          </>
        )}

        <p className="text-center text-2xs text-zo-muted/60 pb-4">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
