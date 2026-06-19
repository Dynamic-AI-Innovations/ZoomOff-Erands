"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@zoomoff/ui";

const FAQ_DATA = {
  Customers: [
    { q: "How quickly will I get a runner?", a: "For ASAP tasks, runners are typically assigned within 3–5 minutes. During peak hours this may extend to 10 minutes, after which you'll be notified and offered the option to wait, widen your search radius, or cancel." },
    { q: "What if my runner doesn't show up?", a: "If a runner accepts a task and becomes unresponsive, you can cancel without a fee and a new runner will be dispatched. Contact support via the SOS button for urgent situations." },
    { q: "How does escrow payment work?", a: "Your payment is held securely when you confirm an errand. It's only released to the runner after you confirm completion — or automatically after 2 hours if you don't respond. You're always protected." },
    { q: "Can I request a specific runner?", a: "Yes. You can mark runners as favourites and request them for new tasks. The system attempts to match your favourite runner; if unavailable it falls back to the nearest available runner." },
    { q: "What is the cancellation policy?", a: "Free cancellation before runner acceptance. A ₦500 fee applies after a runner accepts. Cancellation is not permitted after a runner is en route." },
  ],
  Runners: [
    { q: "How do I get approved?", a: "Submit your NIN, BVN, government ID, biometric selfie, and bank account. KYC is reviewed within 24 hours. You'll then complete 4 Runner Academy modules before your account is activated." },
    { q: "When do I get paid?", a: "Earnings clear to your ZoomOff Errands balance immediately after the customer confirms completion. Standard runners can withdraw the next business day; Elite runners get same-day settlement." },
    { q: "What is the Elite tier?", a: "Elite runners have 4.7+ ratings, 95%+ completion rate, and 200+ tasks. Perks include same-day withdrawals, 15% earnings bonus, priority task matching and a special badge on your profile." },
    { q: "Are there bonuses?", a: "Yes — surge multipliers during peak demand, streak bonuses for high daily task counts, and tier upgrade incentives. Your bonus dashboard shows real-time progress." },
  ],
  Payments: [
    { q: "What payment methods are accepted?", a: "Debit/credit cards (Visa, Mastercard, Verve), ZoomOff Errands Wallet balance, bank transfer, and USSD. Cards are processed securely via Paystack or Flutterwave — we never store card details." },
    { q: "How do I get a refund?", a: "File a dispute within 48 hours of task completion. Approved refunds are credited to your ZoomOff Errands wallet within 24 hours of resolution." },
    { q: "Is my payment data secure?", a: "Absolutely. ZoomOff Errands never stores card numbers, CVVs, or PIN data. All card processing is handled by Paystack and Flutterwave, both PCI DSS certified." },
  ],
  Safety: [
    { q: "How are runners verified?", a: "Every runner passes NIN verification, BVN verification, ID document check (OCR), biometric selfie with liveness detection, bank account verification, and a 4-module training academy." },
    { q: "What if I feel unsafe during a task?", a: "Tap the SOS button in the tracking screen. ZoomOff Errands's Safety Team is immediately notified and will attempt to call you. Keep the app open and move to a safe location." },
    { q: "Is there insurance?", a: "All active ZoomOff Errands tasks are covered under our runner protection policy for damage to items in transit. Detailed terms available in our Terms of Service." },
  ],
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  return (
    <div className="border border-zo-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-zo-bg-light transition-colors"
        aria-expanded={open}
        aria-controls={`faq-${id}`}
      >
        <span className="font-semibold text-brand-charcoal">{question}</span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-zo-muted transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <div id={`faq-${id}`} className="px-5 pb-4 text-sm text-zo-muted leading-relaxed border-t border-zo-border pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export function FAQContent() {
  const [activeCategory, setActiveCategory] = React.useState("Customers");
  const categories = Object.keys(FAQ_DATA);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              activeCategory === cat
                ? "bg-brand-charcoal text-white"
                : "bg-white border border-zo-border text-zo-muted hover:border-brand-charcoal"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {FAQ_DATA[activeCategory as keyof typeof FAQ_DATA].map(({ q, a }) => (
          <FAQItem key={q} question={q} answer={a} />
        ))}
      </div>
    </div>
  );
}
