"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, LogOut, MapPin, Clock, Package,
  Navigation, PlayCircle, CheckCircle2, AlertTriangle,
  Loader2, Phone, ExternalLink,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Task = {
  id: string; category: string; description: string; status: string;
  pickup_address: string; destination_address: string | null;
  notes: string | null; schedule_type: string; scheduled_at: string | null;
  created_at: string; runner_id: string | null;
};

const STATUS_FLOW = [
  { from: "assigned",    to: "en_route",    label: "I'm En Route",  icon: Navigation,    desc: "Tap when you are heading to the pickup location." },
  { from: "en_route",    to: "in_progress", label: "Start Errand",  icon: PlayCircle,    desc: "Tap when you arrive and begin working on the errand." },
  { from: "in_progress", to: "completed",   label: "Mark Complete", icon: CheckCircle2,  desc: "Tap when the errand is fully done and delivered." },
];

const STATUS_BADGE: Record<string, string> = {
  assigned:    "text-blue-700 bg-blue-50 border-blue-200",
  en_route:    "text-orange-700 bg-orange-50 border-orange-200",
  in_progress: "text-amber-700 bg-amber-50 border-amber-200",
  completed:   "text-green-700 bg-green-50 border-green-200",
};

const EARNINGS: Record<string, number> = {
  "Grocery Shopping": 2500, "Document Delivery": 1500, "Food Pickup": 1800,
  "Bank Errand": 2000, "Pharmacy Run": 1500, "Airport Pickup": 5000,
  "Airport Drop-off": 5000, "Laundry": 1500, "Other": 2000,
};

export default function RunnerActiveTaskPage() {
  const router  = useRouter();
  const params  = useParams();
  const taskId  = params?.taskId as string;

  const [task, setTask]       = React.useState<Task | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (!taskId) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const { data, error } = await supabase
        .from("tasks").select("*")
        .eq("id", taskId).eq("runner_id", session.user.id).maybeSingle();
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setTask(data);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [taskId, router]);

  React.useEffect(() => {
    if (!taskId) return;
    const channel = supabase
      .channel(`runner-task-${taskId}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "tasks", filter: `id=eq.${taskId}` },
        (payload) => setTask(prev => prev ? { ...prev, ...(payload.new as Task) } : prev))
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [taskId]);

  async function updateStatus(newStatus: string) {
    if (!task) return;
    setUpdating(true);
    const { error } = await supabase.from("tasks")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", task.id).eq("runner_id", task.runner_id);
    if (!error) {
      setTask(prev => prev ? { ...prev, status: newStatus } : prev);
      if (newStatus === "completed") setTimeout(() => router.push("/runner/earnings"), 2000);
    }
    setUpdating(false);
  }

  async function handleSignOut() { await supabase.auth.signOut(); router.push("/"); }

  if (loading) return (
    <div className="min-h-screen bg-zo-bg-light flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
    </div>
  );

  if (notFound || !task) return (
    <div className="min-h-screen bg-zo-bg-light flex flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
      <h1 className="font-display text-xl font-bold text-brand-charcoal mb-2">Task not found</h1>
      <p className="text-sm text-zo-muted mb-6">This task doesn&apos;t exist or wasn&apos;t assigned to you.</p>
      <Button variant="primary" size="md" asChild><Link href="/runner/tasks">Back to Task Feed</Link></Button>
    </div>
  );

  const nextStep   = STATUS_FLOW.find(s => s.from === task.status);
  const isCompleted = task.status === "completed";
  const est        = EARNINGS[task.category] ?? 2000;

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

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <Link href="/runner/tasks" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Task Feed
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-extrabold text-brand-charcoal">{task.category}</h1>
            <p className="text-xs text-zo-muted mt-0.5">
              {new Date(task.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className={cn("shrink-0 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize",
            STATUS_BADGE[task.status] ?? "text-gray-600 bg-gray-50 border-gray-200")}>
            {task.status.replace("_", " ")}
          </span>
        </div>

        {/* Earnings hint */}
        {!isCompleted && (
          <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 flex items-center justify-between">
            <p className="text-xs text-green-700">Estimated earning for this errand</p>
            <p className="font-bold text-green-700">₦{est.toLocaleString()}</p>
          </div>
        )}

        {/* Task details */}
        <div className="rounded-2xl bg-white border border-zo-border p-5 space-y-4">
          <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">Task Details</p>
          <p className="text-sm text-brand-charcoal leading-relaxed">{task.description}</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-50">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zo-muted">Pickup location</p>
                <p className="text-sm font-semibold text-brand-charcoal">{task.pickup_address}</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(task.pickup_address)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-gold hover:underline mt-0.5">
                  Open in Maps <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            {task.destination_address && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zo-muted">Drop-off location</p>
                  <p className="text-sm font-semibold text-brand-charcoal">{task.destination_address}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(task.destination_address)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-gold hover:underline mt-0.5">
                    Open in Maps <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zo-bg-light">
                <Clock className="h-4 w-4 text-zo-muted" />
              </div>
              <div>
                <p className="text-xs text-zo-muted">Timing</p>
                <p className="text-sm font-semibold text-brand-charcoal">
                  {task.schedule_type === "asap" ? "As soon as possible" :
                   task.scheduled_at ? new Date(task.scheduled_at).toLocaleString("en-NG") : "Scheduled"}
                </p>
              </div>
            </div>

            {task.notes && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs font-semibold text-amber-700 mb-1">Special Instructions</p>
                <p className="text-xs text-brand-charcoal">{task.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed */}
        {isCompleted ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto" />
            <p className="font-bold text-brand-charcoal">Errand Completed!</p>
            <p className="text-xs text-zo-muted">Great work. Your earning of ₦{est.toLocaleString()} has been recorded.</p>
            <Button variant="primary" size="md" className="w-full" asChild>
              <Link href="/runner/earnings">View Earnings</Link>
            </Button>
            <Button variant="outline" size="md" className="w-full" asChild>
              <Link href="/runner/tasks">Back to Task Feed</Link>
            </Button>
          </div>
        ) : nextStep ? (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white border border-zo-border p-5">
              <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-2">Next Action</p>
              <p className="text-xs text-zo-muted mb-4">{nextStep.desc}</p>
              <Button variant="primary" size="lg" className="w-full"
                onClick={() => updateStatus(nextStep.to)} disabled={updating}>
                {updating
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating…</>
                  : <><nextStep.icon className="h-4 w-4 mr-2" />{nextStep.label}</>
                }
              </Button>
            </div>

            <div className="rounded-2xl bg-white border border-zo-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/10">
                  <Phone className="h-4 w-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-charcoal">Contact Customer</p>
                  <p className="text-xs text-zo-muted">In-app messaging coming soon</p>
                </div>
              </div>
              <span className="text-xs text-zo-muted rounded-full bg-zo-bg-light px-2.5 py-1">Soon</span>
            </div>
          </div>
        ) : null}

        <p className="text-center text-2xs text-zo-muted/60 pb-4">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
