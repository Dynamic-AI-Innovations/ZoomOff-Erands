import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { Button, Badge } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Pricing" };

const PRICE_EXAMPLES = [
  { task: "Grocery Shopping (2km)", base: 800, distance: 200, complexity: 300, total: 1300 },
  { task: "Bill Payment — DSTV (1km)", base: 600, distance: 100, complexity: 0, total: 700 },
  { task: "Pharmacy Run (3km)", base: 800, distance: 300, complexity: 0, total: 1100 },
  { task: "Document Pickup & Delivery (5km)", base: 800, distance: 500, complexity: 0, total: 1300 },
  { task: "Banking Errand — Queue (2km)", base: 1000, distance: 200, complexity: 500, total: 1700 },
];

const PLANS = [
  {
    name: "Individual",
    price: "Free",
    period: null,
    description: "Perfect for personal errands",
    badge: null,
    features: [
      "Unlimited errand requests",
      "Live GPS tracking",
      "In-app chat with runner",
      "ZoomOff Wallet",
      "Digital receipts",
      "Dispute resolution",
    ],
    cta: "Get Started",
    href: "https://app.zoomoff.africa/register",
    highlight: false,
  },
  {
    name: "Business — Starter",
    price: "₦15,000",
    period: "/month",
    description: "For small teams up to 5 users",
    badge: "Most Popular",
    features: [
      "Up to 5 team members",
      "50 tasks/month included",
      "Spend analytics dashboard",
      "Task approval workflows",
      "Department tagging",
      "CSV bulk task upload",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/business",
    highlight: true,
  },
  {
    name: "Business — Growth",
    price: "₦45,000",
    period: "/month",
    description: "For growing teams up to 25 users",
    badge: null,
    features: [
      "Up to 25 team members",
      "Unlimited tasks",
      "Advanced analytics & reports",
      "API access + webhooks",
      "Budget alerts",
      "Custom approval chains",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/business#contact",
    highlight: false,
  },
];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function PricingPage() {
  return (
    <div className="py-16">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl font-bold text-brand-charcoal md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-zo-muted max-w-xl mx-auto">
            Pay per errand with no hidden fees. Business plans unlock team management and analytics.
          </p>
        </div>

        {/* Price breakdown */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-2">
            How errand prices are calculated
          </h2>
          <p className="text-zo-muted mb-6">
            Every price is broken down before you confirm — binding within ±15% of the estimate.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Base Rate", desc: "Starting from ₦600 depending on task type", color: "bg-brand-gold" },
              { label: "Distance Fee", desc: "₦100 per kilometre from pickup to destination", color: "bg-brand-charcoal" },
              { label: "Task Complexity", desc: "Added for specialised or time-intensive tasks", color: "bg-zo-info" },
              { label: "Surge Premium", desc: "Applied during peak demand periods — shown clearly", color: "bg-zo-warning" },
            ].map(({ label, desc, color }) => (
              <div key={label} className="rounded-2xl border border-zo-border bg-white p-5 shadow-card">
                <div className={`h-2 w-8 rounded-full ${color} mb-3`} />
                <h3 className="font-semibold text-brand-charcoal">{label}</h3>
                <p className="mt-1 text-sm text-zo-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Price examples */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-6">
            Example task prices
          </h2>
          <div className="overflow-hidden rounded-2xl border border-zo-border bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-zo-bg-light">
                <tr>
                  {["Task", "Base Rate", "Distance Fee", "Complexity", "Total"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zo-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zo-border">
                {PRICE_EXAMPLES.map((row) => (
                  <tr key={row.task} className="hover:bg-zo-bg-light/50">
                    <td className="px-4 py-3 font-medium text-brand-charcoal">{row.task}</td>
                    <td className="px-4 py-3 text-zo-muted">{formatNaira(row.base)}</td>
                    <td className="px-4 py-3 text-zo-muted">{formatNaira(row.distance)}</td>
                    <td className="px-4 py-3 text-zo-muted">{row.complexity > 0 ? formatNaira(row.complexity) : "—"}</td>
                    <td className="px-4 py-3 font-semibold text-brand-charcoal">{formatNaira(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zo-muted flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Prices are estimates and vary based on real-time distance, availability and surge. Final price shown before payment.
          </p>
        </section>

        {/* Business plans */}
        <section>
          <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-2">
            Business plans
          </h2>
          <p className="text-zo-muted mb-8">
            Add team management, approval workflows, analytics, and API access.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 shadow-card flex flex-col ${
                  plan.highlight
                    ? "border-brand-gold bg-brand-gold/5 ring-2 ring-brand-gold"
                    : "border-zo-border bg-white"
                }`}
              >
                {plan.badge && (
                  <Badge variant="gold" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {plan.badge}
                  </Badge>
                )}
                <div className="mb-4">
                  <h3 className="font-display text-lg font-bold text-brand-charcoal">{plan.name}</h3>
                  <p className="text-sm text-zo-muted mt-1">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-brand-charcoal">{plan.price}</span>
                  {plan.period && <span className="text-zo-muted">{plan.period}</span>}
                </div>
                <ul className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-zo-success mt-0.5" aria-hidden="true" />
                      <span className="text-brand-charcoal">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? "primary" : "outline"}
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link href={plan.href}>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
