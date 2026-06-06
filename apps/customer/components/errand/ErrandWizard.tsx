"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useErrandStore } from "@/lib/errand-store";
import { Step1Category } from "./steps/Step1Category";
import { Step2Description } from "./steps/Step2Description";
import { Step3Addresses } from "./steps/Step3Addresses";
import { Step4Photos } from "./steps/Step4Photos";
import { Step5Schedule } from "./steps/Step5Schedule";
import { Step6Instructions } from "./steps/Step6Instructions";
import { Step7PriceReview } from "./steps/Step7PriceReview";
import { Step8Payment } from "./steps/Step8Payment";
import { cn } from "@zoomoff/ui";

const STEPS = [
  { number: 1, label: "Type" },
  { number: 2, label: "Details" },
  { number: 3, label: "Location" },
  { number: 4, label: "Photos" },
  { number: 5, label: "Schedule" },
  { number: 6, label: "Notes" },
  { number: 7, label: "Price" },
  { number: 8, label: "Pay" },
];

export function ErrandWizard() {
  const { currentStep } = useErrandStore();

  const StepComponent = [
    Step1Category, Step2Description, Step3Addresses, Step4Photos,
    Step5Schedule, Step6Instructions, Step7PriceReview, Step8Payment,
  ][currentStep - 1];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Post an Errand</h1>
        <p className="text-sm text-zo-muted mt-1">Step {currentStep} of {STEPS.length}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex gap-1 mb-3">
          {STEPS.map((s) => (
            <div
              key={s.number}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s.number <= currentStep ? "bg-brand-gold" : "bg-zo-border"
              )}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {STEPS.map((s) => (
            <span
              key={s.number}
              className={cn(
                "text-2xs font-medium hidden sm:block",
                s.number === currentStep ? "text-brand-charcoal" : "text-zo-muted"
              )}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zo-border bg-white p-6 shadow-card">
        {StepComponent && <StepComponent />}
      </div>
    </div>
  );
}
