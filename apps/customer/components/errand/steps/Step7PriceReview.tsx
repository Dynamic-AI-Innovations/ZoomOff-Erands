"use client";

import * as React from "react";
import { Zap, RefreshCw } from "lucide-react";
import { Button, Card, Skeleton, useToast } from "@zoomoff/ui";
import { useErrandStore } from "@/lib/errand-store";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@zoomoff/api-client";

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

export function Step7PriceReview() {
  const { draft, updateDraft, setStep } = useErrandStore();
  const { toast } = useToast();

  const { data: estimate, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["price-estimate", draft],
    queryFn: () =>
      tasksApi.estimatePrice({
        category: draft.category!,
        description: draft.description,
        pickup: draft.pickup!,
        destination: draft.destination!,
        waypoints: draft.waypoints,
        scheduleType: draft.scheduleType!,
        scheduledAt: draft.scheduledDate && draft.scheduledTime
          ? `${draft.scheduledDate}T${draft.scheduledTime}:00`
          : undefined,
        isUrgent: draft.isUrgent,
      }),
    enabled: !!draft.category && !!draft.pickup && !!draft.destination,
    staleTime: 5 * 60 * 1000, // 5-min validity
    retry: 1,
  });

  // Expiry countdown
  const [secondsLeft, setSecondsLeft] = React.useState(300);
  React.useEffect(() => {
    setSecondsLeft(300);
    const interval = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  function next() {
    if (!estimate) return;
    updateDraft({ priceEstimate: estimate, priceEstimateExpiry: Date.now() + 5 * 60 * 1000 });
    setStep(8);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-brand-charcoal">Getting your price estimate...</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={20} />)}
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-zo-muted">Could not fetch estimate.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const rows = [
    { label: "Base Rate", value: estimate.baseRate },
    { label: "Distance Fee", value: estimate.distanceFee },
    { label: "Task Complexity", value: estimate.complexityFee },
    ...(estimate.hasSurge ? [{ label: "Surge Premium ⚡", value: estimate.surgePremium }] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-charcoal">Your price estimate</h2>
        <p className="text-sm text-zo-muted mt-1">
          Valid for{" "}
          <span className={secondsLeft < 60 ? "text-zo-error font-semibold" : "font-semibold text-brand-charcoal"}>
            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
          </span>
          {" "}· ±15% binding estimate
        </p>
      </div>

      <Card>
        <div className="divide-y divide-zo-border">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <span className="text-sm text-zo-muted">{label}</span>
              <span className="text-sm font-semibold text-brand-charcoal">{formatNaira(value)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-brand-gold">
          <span className="font-display text-lg font-bold text-brand-charcoal">Total</span>
          <span className="font-display text-2xl font-bold text-brand-charcoal">{formatNaira(estimate.total)}</span>
        </div>
      </Card>

      {estimate.hasSurge && (
        <div className="flex items-center gap-2 rounded-xl bg-zo-warning-light border border-zo-warning/30 p-3 text-sm text-zo-warning">
          <Zap className="h-4 w-4 shrink-0" aria-hidden="true" />
          Surge pricing is active in your area right now.
        </div>
      )}

      {secondsLeft === 0 && (
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-sm text-brand-gold font-medium hover:underline"
        >
          <RefreshCw className="h-4 w-4" /> Refresh estimate
        </button>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(6)}>← Back</Button>
        <Button variant="primary" size="lg" disabled={secondsLeft === 0} onClick={next}>
          Proceed to Payment →
        </Button>
      </div>
    </div>
  );
}
