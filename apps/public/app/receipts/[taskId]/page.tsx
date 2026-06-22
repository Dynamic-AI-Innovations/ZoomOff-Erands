"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Printer, Package, MapPin, Clock,
  CheckCircle2, AlertTriangle,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Task = {
  id: string; category: string; description: string; status: string;
  pickup_address: string; destination_address: string | null;
  notes: string | null; schedule_type: string; scheduled_at: string | null;
  created_at: string; updated_at: string | null; runner_id: string | null;
};

const PRICE: Record<string, number> = {
  "Grocery Shopping": 2500, "Document Delivery": 1500, "Food Pickup": 1800,
  "Bank Errand": 2000, "Pharmacy Run": 1500, "Airport Pickup": 5000,
  "Airport Drop-off": 5000, "Laundry": 1500, "Other": 2000,
};

function formatNGN(n: number) {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

export default function ReceiptPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.taskId as string;

  const [task, setTask]         = React.useState<Task | null>(null);
  const [loading, setLoading]   = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  React.useEffect(() => {
    if (!taskId) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUserEmail(session.user.email ?? "");
      const { data, error } = await supabase.from("tasks").select("*")
        .eq("id", taskId).eq("user_id", session.user.id).maybeSingle();
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setTask(data);
      setLoading(false);
    });
  }, [taskId, router]);

  if (loading) return (
    <div className="min-h-screen bg-zo-bg-light flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
    </div>
  );

  if (notFound || !task) return (
    <div className="min-h-screen bg-zo-bg-light flex flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
      <h1 className="font-display text-xl font-bold text-brand-charcoal mb-2">Receipt not found</h1>
      <Button variant="primary" asChild><Link href="/errands">My Errands</Link></Button>
    </div>
  );

  const basePrice   = PRICE[task.category] ?? 2000;
  const serviceFee  = Math.round(basePrice * 0.05);
  const total       = basePrice + serviceFee;
  const receiptNo   = `ZO-${task.id.slice(0, 8).toUpperCase()}`;
  const completedAt = task.updated_at
    ? new Date(task.updated_at).toLocaleString("en-NG")
    : new Date(task.created_at).toLocaleString("en-NG");

  return (
    <div className="min-h-screen bg-zo-bg-light">
      <header className="bg-white border-b border-zo-border print:hidden">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/"><Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority /></Link>
          <button onClick={() => window.print()}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-charcoal hover:text-brand-gold transition-colors">
            <Printer className="h-4 w-4" /> Print Receipt
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Link href="/errands" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors print:hidden">
          <ArrowLeft className="h-4 w-4" /> My Errands
        </Link>

        {/* Receipt card */}
        <div className="rounded-2xl bg-white border border-zo-border p-6 space-y-5 print:border-0 print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-zo-border">
            <div>
              <Image src="/logo.png" alt="ZoomOff Errands" width={120} height={48} className="h-12 w-auto object-contain mb-2" />
              <p className="text-xs text-zo-muted">ZoomOff Errands · zoomoff.africa</p>
              <p className="text-xs text-zo-muted">support@zoomoff.africa</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold text-brand-charcoal">RECEIPT</p>
              <p className="text-xs text-zo-muted mt-0.5">#{receiptNo}</p>
              <p className="text-xs text-zo-muted">{completedAt}</p>
            </div>
          </div>

          {/* Status */}
          {task.status === "completed" ? (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-xs font-semibold text-green-700">Payment Confirmed · Errand Completed</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-xs font-semibold text-amber-700">Errand {task.status.replace("_", " ")} — receipt will update on completion</p>
            </div>
          )}

          {/* Billed to */}
          <div>
            <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-2">Billed To</p>
            <p className="text-sm text-brand-charcoal">{userEmail}</p>
          </div>

          {/* Errand details */}
          <div>
            <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-3">Errand Details</p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-zo-muted mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zo-muted">Service</p>
                  <p className="text-sm font-semibold text-brand-charcoal">{task.category}</p>
                  <p className="text-xs text-zo-muted mt-0.5">{task.description}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zo-muted">Pickup</p>
                  <p className="text-sm font-semibold text-brand-charcoal">{task.pickup_address}</p>
                </div>
              </div>
              {task.destination_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-zo-muted">Drop-off</p>
                    <p className="text-sm font-semibold text-brand-charcoal">{task.destination_address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="border-t border-zo-border pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zo-muted">Errand fee</span>
              <span className="font-medium text-brand-charcoal">{formatNGN(basePrice)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zo-muted">Service fee (5%)</span>
              <span className="font-medium text-brand-charcoal">{formatNGN(serviceFee)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-zo-border pt-2">
              <span className="font-bold text-brand-charcoal">Total</span>
              <span className="font-display text-xl font-extrabold text-brand-charcoal">{formatNGN(total)}</span>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-zo-muted text-center border-t border-zo-border pt-4">
            Thank you for using ZoomOff Errands. For support, contact support@zoomoff.africa<br />
            Powered by Dynamics Technology
          </p>
        </div>

        <div className="flex gap-3 print:hidden">
          <Button variant="outline" size="md" className="flex-1" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Print / Save PDF
          </Button>
          <Button variant="primary" size="md" className="flex-1" asChild>
            <Link href="/errands">Back to Errands</Link>
          </Button>
        </div>

        <p className="text-center text-2xs text-zo-muted/60 pb-4 print:hidden">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
