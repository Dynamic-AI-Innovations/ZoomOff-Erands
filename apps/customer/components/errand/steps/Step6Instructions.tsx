"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button, cn } from "@zoomoff/ui";
import { useErrandStore } from "@/lib/errand-store";

export function Step6Instructions() {
  const { draft, updateDraft, setStep } = useErrandStore();
  const [instructions, setInstructions] = React.useState(draft.specialInstructions);
  const [isUrgent, setIsUrgent] = React.useState(draft.isUrgent);

  function next() {
    updateDraft({ specialInstructions: instructions.trim(), isUrgent });
    setStep(7);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-charcoal">Any special instructions?</h2>
        <p className="text-sm text-zo-muted mt-1">Optional — help your runner handle edge cases</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Instructions (optional)</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value.slice(0, 500))}
          rows={4}
          placeholder="e.g. Call me before purchasing. If item A is not available, skip it. Access via back gate."
          className="w-full rounded-xl border border-zo-border bg-white px-3 py-2.5 text-sm text-brand-charcoal placeholder:text-zo-muted resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        />
        <p className="text-xs text-right text-zo-muted">{instructions.length}/500</p>
      </div>

      {/* Urgent toggle */}
      <button
        onClick={() => setIsUrgent((v) => !v)}
        className={cn(
          "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
          isUrgent
            ? "border-zo-warning bg-zo-warning-light ring-1 ring-zo-warning"
            : "border-zo-border bg-white hover:border-brand-charcoal/30"
        )}
        aria-pressed={isUrgent}
      >
        <AlertTriangle
          className={cn("h-5 w-5 shrink-0", isUrgent ? "text-zo-warning" : "text-zo-muted")}
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-brand-charcoal">Mark as urgent</p>
          <p className="text-sm text-zo-muted">Prioritises your errand during high-demand periods (surge pricing may apply)</p>
        </div>
        <div className={cn(
          "ml-auto flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          isUrgent ? "bg-zo-warning justify-end" : "bg-zo-border justify-start"
        )}>
          <div className="h-4 w-4 rounded-full bg-white shadow mx-0.5" />
        </div>
      </button>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(5)}>← Back</Button>
        <Button variant="primary" size="lg" onClick={next}>
          Get Price Estimate →
        </Button>
      </div>
    </div>
  );
}
