import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UserCheck, MapPin, CreditCard, Star } from "lucide-react";
import { Button } from "@zoomoff/ui";

export const metadata: Metadata = { title: "How It Works" };

const CUSTOMER_STEPS = [
  {
    step: 1,
    icon: ArrowRight,
    title: "Post your errand",
    desc: "Choose a task type, describe what you need, set pickup and destination addresses using Google Maps autocomplete, attach photos, and pick a schedule — instant, today, or up to 7 days ahead.",
  },
  {
    step: 2,
    icon: UserCheck,
    title: "Get matched with a verified runner",
    desc: "Our AI instantly matches you with the closest, highest-rated available runner. You see their profile, photo, rating, and tier before they head out.",
  },
  {
    step: 3,
    icon: MapPin,
    title: "Track in real time",
    desc: "Watch your runner on a live GPS map with 5-second location updates. Chat directly via in-app messaging, see ETA updates, and tap SOS if you ever need help.",
  },
  {
    step: 4,
    icon: CreditCard,
    title: "Pay securely via escrow",
    desc: "Your payment is held safely until you confirm the errand is complete. Release payment with one tap or sign off with a digital signature — then rate your runner.",
  },
];

const RUNNER_STEPS = [
  {
    step: 1,
    title: "Register & complete KYC",
    desc: "Submit your NIN, BVN, government ID, biometric selfie and bank account. Verified in under 24 hours.",
  },
  {
    step: 2,
    title: "Complete Runner Academy",
    desc: "Four mandatory modules on platform policies, safety and proof-of-completion. Takes about 30 minutes.",
  },
  {
    step: 3,
    title: "Go online & accept tasks",
    desc: "Toggle online to see nearby tasks. Preview pay, location and task details before accepting. 45-second acceptance window.",
  },
  {
    step: 4,
    title: "Complete & earn",
    desc: "Submit photo proof and customer OTP or signature. Earnings hit your dashboard instantly. Withdraw to your bank any time.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-16">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl font-bold text-brand-charcoal md:text-5xl">
            How ZoomOff Errands Works
          </h1>
          <p className="mt-4 text-lg text-zo-muted max-w-xl mx-auto">
            Posting an errand takes under 3 minutes. Here&apos;s everything that happens.
          </p>
        </div>

        {/* Customer flow */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-8">
            For Customers
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CUSTOMER_STEPS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative rounded-2xl border border-zo-border bg-white p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold font-display text-lg font-bold text-brand-charcoal">
                    {step}
                  </div>
                  <Icon className="h-5 w-5 text-zo-muted" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-brand-charcoal">{title}</h3>
                <p className="mt-2 text-sm text-zo-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/delegate">
                Post Your First Errand
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Runner flow */}
        <section className="rounded-3xl bg-zo-bg-light p-8 md:p-12">
          <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-8">
            For Runners
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {RUNNER_STEPS.map(({ step, title, desc }) => (
              <div key={step} className="rounded-2xl bg-white p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-charcoal font-display text-lg font-bold text-brand-gold mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-brand-charcoal">{title}</h3>
                <p className="mt-2 text-sm text-zo-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/become-a-runner">
                Become a Runner
                <Star className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
