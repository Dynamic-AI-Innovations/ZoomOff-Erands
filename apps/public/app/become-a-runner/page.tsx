import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, DollarSign, Star } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { EarningsCalculator } from "./EarningsCalculator";

export const metadata: Metadata = {
  title: "Become a Runner — Earn on Your Schedule",
  description: "Join ZoomOff Errands as a verified runner. Earn ₦25,000–₦150,000/month running errands on your own schedule.",
};

const REQUIREMENTS = [
  "Nigerian citizen, 18 years or older",
  "Valid government-issued ID",
  "Active bank account (NIN + BVN verified)",
  "Smartphone with data connection",
  "Willingness to complete 4 training modules",
];

const PERKS = [
  { icon: DollarSign, title: "Earn ₦25k–₦120k/month", desc: "Keep your own schedule. More hours = more earnings." },
  { icon: Star, title: "Elite tier bonuses", desc: "Top-rated runners unlock same-day withdrawals and 15% bonus." },
  { icon: Shield, title: "Insured on every task", desc: "All active tasks covered under ZoomOff Errands's runner protection." },
];

export default function BecomeARunnerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-charcoal py-20">
        <div className="container-max section-padding text-center">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl text-balance">
            Run errands. <span className="text-brand-gold">Earn daily.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-300 text-balance">
            Join thousands of ZoomOff Errands runners earning on their own schedule. Apply in 10 minutes, earn within 24 hours of approval.
          </p>
          <Button size="xl" variant="primary" className="mt-8" asChild>
            <Link href="/runner-apply">
              Start Application
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16">
        <div className="container-max section-padding">
          <div className="grid gap-6 md:grid-cols-3">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-zo-border bg-white p-6 shadow-card">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-charcoal">{title}</h3>
                  <p className="mt-1 text-sm text-zo-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings calculator */}
      <section className="bg-zo-bg-light py-16" id="earnings">
        <div className="container-max section-padding">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-brand-charcoal">How much could you earn?</h2>
            <p className="mt-3 text-zo-muted">Adjust the sliders to estimate your monthly income</p>
          </div>
          <EarningsCalculator />
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16" id="requirements">
        <div className="container-max section-padding max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-brand-charcoal mb-8 text-center">Requirements</h2>
          <div className="space-y-3">
            {REQUIREMENTS.map((req) => (
              <div key={req} className="flex items-center gap-3 rounded-xl border border-zo-border bg-white p-4">
                <CheckCircle2 className="h-5 w-5 text-zo-success shrink-0" aria-hidden="true" />
                <p className="text-sm text-brand-charcoal">{req}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="xl" variant="primary" asChild>
              <Link href="/runner-apply">
                Apply Now — It&apos;s Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
