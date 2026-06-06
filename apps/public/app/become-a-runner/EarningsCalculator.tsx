"use client";

import * as React from "react";
import { Card } from "@zoomoff/ui";

const AVG_TASK_VALUE = 1_800; // ₦ per task

export function EarningsCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = React.useState(20);
  const [tasksPerHour, setTasksPerHour] = React.useState(2);

  const monthlyEstimate = Math.round(hoursPerWeek * tasksPerHour * AVG_TASK_VALUE * 4.3);

  return (
    <div className="max-w-lg mx-auto">
      <Card className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-brand-charcoal">Hours per week</label>
            <span className="font-display text-xl font-bold text-brand-gold">{hoursPerWeek}h</span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={hoursPerWeek}
            onChange={e => setHoursPerWeek(parseInt(e.target.value))}
            className="w-full accent-brand-gold"
            aria-label="Hours per week"
          />
          <div className="flex justify-between text-xs text-zo-muted">
            <span>5h (casual)</span><span>60h (full-time)</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-brand-charcoal">Tasks per hour</label>
            <span className="font-display text-xl font-bold text-brand-gold">{tasksPerHour}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={tasksPerHour}
            onChange={e => setTasksPerHour(parseInt(e.target.value))}
            className="w-full accent-brand-gold"
            aria-label="Tasks per hour"
          />
          <div className="flex justify-between text-xs text-zo-muted">
            <span>1 (leisurely)</span><span>4 (high-velocity)</span>
          </div>
        </div>

        <div className="rounded-2xl bg-brand-gold/10 border border-brand-gold p-5 text-center">
          <p className="text-xs text-zo-muted uppercase tracking-wide font-semibold">Estimated Monthly Earnings</p>
          <p className="font-display text-5xl font-bold text-brand-charcoal mt-2">
            ₦{monthlyEstimate.toLocaleString("en-NG")}
          </p>
          <p className="text-xs text-zo-muted mt-2">
            Based on avg ₦{AVG_TASK_VALUE.toLocaleString()} per task · {hoursPerWeek * tasksPerHour * 4} tasks/month
          </p>
        </div>
        <p className="text-xs text-zo-muted text-center">
          Estimate only. Actual earnings vary by location, task type, and availability.
        </p>
      </Card>
    </div>
  );
}
