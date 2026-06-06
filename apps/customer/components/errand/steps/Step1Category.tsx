"use client";

import * as React from "react";
import {
  ShoppingCart, FileText, Pill, CreditCard, Building2,
  Users, Package, ClipboardList, Home, PenLine,
} from "lucide-react";
import { Button, Input, cn } from "@zoomoff/ui";
import { useErrandStore } from "@/lib/errand-store";
import type { TaskCategory } from "@zoomoff/validators";

const CATEGORIES: { id: TaskCategory; icon: React.ElementType; label: string; example: string }[] = [
  { id: "grocery_shopping", icon: ShoppingCart, label: "Grocery Shopping", example: "Supermarket, fresh market" },
  { id: "document_pickup_delivery", icon: FileText, label: "Document Pickup/Delivery", example: "Courier, certificates" },
  { id: "pharmacy_run", icon: Pill, label: "Pharmacy Run", example: "Medication, health items" },
  { id: "bill_payment", icon: CreditCard, label: "Bill Payment", example: "DSTV, NEPA, bank deposits" },
  { id: "banking_errand", icon: Building2, label: "Banking Errand", example: "Deposits, withdrawals, queuing" },
  { id: "queue_standing", icon: Users, label: "Queue Standing", example: "Hold your place anywhere" },
  { id: "parcel_delivery", icon: Package, label: "Parcel Delivery", example: "Same-day city delivery" },
  { id: "administrative_errand", icon: ClipboardList, label: "Administrative", example: "Permits, government offices" },
  { id: "home_errand", icon: Home, label: "Home Errand", example: "Household tasks" },
  { id: "other", icon: PenLine, label: "Other", example: "Describe your errand" },
];

export function Step1Category() {
  const { draft, updateDraft, setStep } = useErrandStore();
  const [selected, setSelected] = React.useState<TaskCategory | null>(draft.category);
  const [otherText, setOtherText] = React.useState(draft.categoryOther);

  function next() {
    if (!selected) return;
    updateDraft({ category: selected, categoryOther: otherText });
    setStep(2);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-charcoal">What do you need help with?</h2>
        <p className="text-sm text-zo-muted mt-1">Select the type of errand</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map(({ id, icon: Icon, label, example }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
              selected === id
                ? "border-brand-gold bg-brand-gold/10 shadow-sm"
                : "border-zo-border bg-white hover:border-brand-charcoal/30"
            )}
            aria-pressed={selected === id}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              selected === id ? "bg-brand-gold text-brand-charcoal" : "bg-zo-bg-light text-zo-muted"
            )}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-charcoal">{label}</p>
              <p className="text-2xs text-zo-muted mt-0.5">{example}</p>
            </div>
          </button>
        ))}
      </div>

      {selected === "other" && (
        <Input
          label="Describe your errand type"
          placeholder="e.g. Car wash, laundry pickup..."
          value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
        />
      )}

      <div className="flex justify-end pt-2">
        <Button variant="primary" size="lg" disabled={!selected || (selected === "other" && !otherText.trim())} onClick={next}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
