import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart, FileText, Pill, CreditCard, Building2,
  Users, Package, ClipboardList, Home, ArrowRight, Star, MapPin, CheckCircle
} from "lucide-react";
import { Button } from "@zoomoff/ui";

export const metadata: Metadata = {
  title: "ZoomOff — Fast, Trusted Errands Across Nigeria",
};

const TASK_CATEGORIES = [
  { icon: ShoppingCart, label: "Grocery Shopping", desc: "Fresh market runs, supermarket pickups" },
  { icon: FileText, label: "Document Pickup", desc: "Courier & document delivery" },
  { icon: Pill, label: "Pharmacy Run", desc: "Medication & healthcare pickups" },
  { icon: CreditCard, label: "Bill Payment", desc: "DSTV, utilities, bank payments" },
  { icon: Building2, label: "Banking Errand", desc: "Deposits, withdrawals, queuing" },
  { icon: Users, label: "Queue Standing", desc: "Hold your place anywhere" },
  { icon: Package, label: "Parcel Delivery", desc: "Same-day city deliveries" },
  { icon: ClipboardList, label: "Administrative", desc: "Forms, permits, government offices" },
  { icon: Home, label: "Home Errand", desc: "Household tasks & errands" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Post your errand",
    desc: "Describe what you need, add pickup/drop-off locations, photos, and a schedule.",
  },
  {
    step: "02",
    title: "Get matched instantly",
    desc: "Our AI matches you with a verified, nearby runner in seconds.",
  },
  {
    step: "03",
    title: "Track in real time",
    desc: "Watch your runner on a live map with continuous ETA updates.",
  },
  {
    step: "04",
    title: "Pay & rate",
    desc: "Confirm completion and release payment. Leave your review.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zo-bg-dark py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-zo-bg-dark to-black" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 60%, #F7C438 0%, transparent 50%)",
          }}
        />
        <div className="relative container-max section-padding text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-sm text-brand-gold mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
            Now live in Lagos, Abuja & Port Harcourt
          </div>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            Your errands,{" "}
            <span className="text-brand-gold">handled fast.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 text-balance">
            ZoomOff connects you with verified, GPS-tracked runners ready to handle
            grocery runs, deliveries, banking, and more — instantly or scheduled.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="xl" variant="primary" asChild>
              <Link href="https://app.zoomoff.africa/register">
                Post an Errand
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/become-a-runner">Become a Runner</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm">
            {[
              { value: "50,000+", label: "Errands Completed" },
              { value: "4.8★", label: "Average Rating" },
              { value: "3 Cities", label: "And Growing" },
              { value: "<5 min", label: "Avg Match Time" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="font-display text-2xl font-bold text-brand-gold">{stat.value}</span>
                <span className="text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Task categories */}
      <section id="categories" className="py-20">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl">
              What can we handle for you?
            </h2>
            <p className="mt-3 text-zo-muted">
              From grocery runs to government office errands — your runner can do it all.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {TASK_CATEGORIES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-zo-border bg-white p-4 text-center shadow-card transition-all hover:border-brand-gold hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-charcoal">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-charcoal">{label}</p>
                  <p className="mt-0.5 text-xs text-zo-muted">{desc}</p>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zo-border bg-zo-bg-light p-4 text-center">
              <p className="text-sm font-semibold text-zo-muted">Something else?</p>
              <p className="text-xs text-zo-muted">We handle custom errands too.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-zo-bg-light py-20">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl">
              How ZoomOff works
            </h2>
            <p className="mt-3 text-zo-muted">Four simple steps between you and a completed errand.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute right-0 top-6 hidden h-0.5 w-1/2 bg-brand-gold/30 md:block" />
                )}
                <div className="rounded-2xl bg-white p-6 shadow-card">
                  <span className="font-display text-4xl font-bold text-brand-gold/30">{step.step}</span>
                  <h3 className="mt-2 font-semibold text-brand-charcoal">{step.title}</h3>
                  <p className="mt-1 text-sm text-zo-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-20">
        <div className="container-max section-padding">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: CheckCircle,
                title: "KYC-Verified Runners",
                desc: "Every runner passes NIN, BVN, biometric selfie and ID document checks before their first task.",
              },
              {
                icon: MapPin,
                title: "Live GPS Tracking",
                desc: "Watch your runner in real time on an embedded map with 5-second location updates.",
              },
              {
                icon: Star,
                title: "Escrow Payment Protection",
                desc: "Your payment is held in escrow and only released to the runner after you confirm completion.",
              },
            ].map(({ icon: Icon, title, desc }) => (
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

      {/* CTA banner */}
      <section className="bg-brand-gold py-16">
        <div className="container-max section-padding text-center">
          <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl">
            Ready to run your first errand?
          </h2>
          <p className="mt-3 text-brand-charcoal/70">
            Join thousands of Nigerians who trust ZoomOff every day.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="xl" variant="secondary" asChild>
              <Link href="https://app.zoomoff.africa/register">
                Get Started — It&apos;s Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="border-brand-charcoal/30" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
