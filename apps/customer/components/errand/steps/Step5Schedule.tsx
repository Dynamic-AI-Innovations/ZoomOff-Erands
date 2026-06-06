"use client";

import * as React from "react";
import { Zap, Clock, Calendar } from "lucide-react";
import { Button, cn } from "@zoomoff/ui";
import { useErrandStore } from "@/lib/errand-store";

type ScheduleType = "instant" | "today" | "scheduled";

const OPTIONS: { id: ScheduleType; icon: React.ElementType; label: string; desc: string }[] = [
  { id: "instant", icon: Zap, label: "ASAP", desc: "Get a runner right now — typically under 5 minutes" },
  { id: "today", icon: Clock, label: "Today", desc: "Pick a specific time window today" },
  { id: "scheduled", icon: Calendar, label: "Scheduled", desc: "Book for a future date (up to 7 days ahead)" },
];

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0]!;
}

function getMaxDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0]!;
}

export function Step5Schedule() {
  const { draft, updateDraft, setStep } = useErrandStore();
  const [type, setType] = React.useState<ScheduleType | null>(draft.scheduleType);
  const [date, setDate] = React.useState(draft.scheduledDate);
  const [time, setTime] = React.useState(draft.scheduledTime);

  const today = new Date().toISOString().split("T")[0]!;

  const canContinue =
    type === "instant" ||
    (type === "today" && !!time) ||
    (type === "scheduled" && !!date && !!time);

  function next() {
    if (!type) return;
    updateDraft({ scheduleType: type, scheduledDate: date, scheduledTime: time });
    setStep(6);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-charcoal">When do you need this?</h2>
        <p className="text-sm text-zo-muted mt-1">Choose your preferred timing</p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map(({ id, icon: Icon, label, desc }) => (
          <button
            key={id}
            onClick={() => setType(id)}
            className={cn(
              "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all",
              type === id
                ? "border-brand-gold bg-brand-gold/5 ring-1 ring-brand-gold"
                : "border-zo-border bg-white hover:border-brand-charcoal/30"
            )}
            aria-pressed={type === id}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              type === id ? "bg-brand-gold text-brand-charcoal" : "bg-zo-bg-light text-zo-muted"
            )}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-brand-charcoal">{label}</p>
              <p className="text-sm text-zo-muted mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Time pickers */}
      {type === "today" && (
        <div className="rounded-xl border border-zo-border bg-zo-bg-light p-4 space-y-3">
          <p className="text-sm font-semibold text-brand-charcoal">Select time window</p>
          <input
            type="time"
            value={time}
            min={new Date(Date.now() + 30 * 60 * 1000).toTimeString().slice(0, 5)}
            onChange={(e) => setTime(e.target.value)}
            className="h-10 rounded-xl border border-zo-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          />
          <p className="text-xs text-zo-muted">Minimum 30 minutes advance notice required</p>
        </div>
      )}

      {type === "scheduled" && (
        <div className="rounded-xl border border-zo-border bg-zo-bg-light p-4 space-y-3">
          <p className="text-sm font-semibold text-brand-charcoal">Select date & time</p>
          <div className="flex gap-3">
            <input
              type="date"
              value={date}
              min={today}
              max={getMaxDate()}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 flex-1 rounded-xl border border-zo-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-10 flex-1 rounded-xl border border-zo-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            />
          </div>
          <p className="text-xs text-zo-muted">Up to 7 days ahead. Minimum 30-minute advance notice.</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(4)}>← Back</Button>
        <Button variant="primary" size="lg" disabled={!canContinue} onClick={next}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
