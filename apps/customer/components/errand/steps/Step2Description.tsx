"use client";

import * as React from "react";
import { Button } from "@zoomoff/ui";
import { useErrandStore } from "@/lib/errand-store";

const MAX = 1000;

export function Step2Description() {
  const { draft, updateDraft, setStep } = useErrandStore();
  const [value, setValue] = React.useState(draft.description);

  function next() {
    updateDraft({ description: value.trim() });
    setStep(3);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-charcoal">Describe what you need</h2>
        <p className="text-sm text-zo-muted mt-1">Be as specific as possible — your runner will see this</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Description</label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX))}
          rows={6}
          placeholder="e.g. Please buy 2 bags of rice (10kg each) and a bottle of groundnut oil from Shoprite Lekki. Pay by transfer. Bring receipt."
          className="w-full rounded-xl border border-zo-border bg-white px-3 py-2.5 text-sm text-brand-charcoal placeholder:text-zo-muted resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        />
        <p className={`text-xs text-right ${value.length >= MAX * 0.9 ? "text-zo-warning" : "text-zo-muted"}`}>
          {value.length}/{MAX}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
        <Button variant="primary" size="lg" disabled={value.trim().length < 10} onClick={next}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
