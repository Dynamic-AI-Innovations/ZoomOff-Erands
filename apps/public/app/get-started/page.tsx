import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Bike, Building2, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Get Started | ZoomOff Errands",
  description: "Join ZoomOff Errands as a customer, runner, or business. Choose your account type to get started.",
};

const ACCOUNT_TYPES = [
  {
    icon: ShoppingCart,
    tag: "Most popular",
    title: "I need errands done",
    subtitle: "Customer account",
    desc: "Delegate grocery runs, deliveries, banking, document pickups and more to a verified runner.",
    perks: [
      "Post any errand in 60 seconds",
      "Real-time GPS tracking on every task",
      "Escrow payment — pay only when done",
      "Instant or scheduled, 7 days a week",
    ],
    href: "/delegate",
    cta: "Delegate an Errand Free",
    accent: true,
  },
  {
    icon: Bike,
    tag: "Earn daily",
    title: "I want to earn as a Runner",
    subtitle: "Runner account",
    desc: "Accept errand tasks near you, earn on your own schedule, and get paid same-day to your bank.",
    perks: [
      "Earn ₦3,500+ per task on average",
      "Same-day payout to any Nigerian bank",
      "Choose which tasks you accept",
      "Full ZoomOff Errands runner insurance cover",
    ],
    href: "/runner-apply",
    cta: "Apply as a Runner",
    accent: false,
  },
  {
    icon: Building2,
    tag: "For organisations",
    title: "My business needs errands",
    subtitle: "Business account",
    desc: "Manage team errands, track spending, access volume pricing, and integrate via our API.",
    perks: [
      "Team dashboard with role management",
      "Monthly invoice and expense reports",
      "Volume discounts from 20+ tasks/month",
      "Dedicated account manager",
    ],
    href: "/business-register",
    cta: "Set Up Business Account",
    accent: false,
  },
];

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-zo-bg-light">
      {/* Header */}
      <div className="border-b border-zo-border bg-white">
        <div className="container-max section-padding flex h-16 items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <Link href="/login" className="text-sm font-medium text-zo-muted hover:text-brand-charcoal transition-colors">
            Already have an account? <span className="text-brand-gold">Log in</span>
          </Link>
        </div>
      </div>

      <div className="container-max section-padding py-14 max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-3">Welcome to ZoomOff Errands</p>
          <h1 className="font-display text-3xl font-extrabold text-brand-charcoal tracking-tight md:text-4xl">
            How would you like to join?
          </h1>
          <p className="mt-3 text-zo-muted max-w-md mx-auto">
            Choose the account type that matches what you need. You can always upgrade later.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {ACCOUNT_TYPES.map(({ icon: Icon, tag, title, subtitle, desc, perks, href, cta, accent }) => (
            <Link
              key={title}
              href={href}
              className={`group relative flex flex-col rounded-2xl border-2 p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover ${
                accent
                  ? "border-brand-gold bg-white shadow-card"
                  : "border-zo-border bg-white hover:border-brand-gold/50"
              }`}
            >
              {/* Tag */}
              <div className={`inline-flex items-center self-start rounded-full px-3 py-1 text-2xs font-bold uppercase tracking-widest mb-5 ${
                accent ? "bg-brand-gold text-brand-charcoal" : "bg-zo-bg-light text-zo-muted"
              }`}>
                {tag}
              </div>

              {/* Icon + titles */}
              <div className={`flex h-14 w-14 items-center justify-center rounded-full mb-5 transition-colors ${
                accent ? "bg-brand-gold/20 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-charcoal" : "bg-zo-bg-light text-zo-muted group-hover:bg-brand-gold/10 group-hover:text-brand-gold"
              }`}>
                <Icon className="h-7 w-7" aria-hidden="true" />
              </div>

              <h2 className="font-display text-lg font-extrabold text-brand-charcoal tracking-tight leading-snug">
                {title}
              </h2>
              <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mt-0.5 mb-3">{subtitle}</p>
              <p className="text-sm text-zo-muted leading-relaxed mb-6">{desc}</p>

              {/* Perks */}
              <ul className="space-y-2.5 flex-1 mb-7">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm text-brand-charcoal">
                    <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                accent
                  ? "bg-brand-gold text-brand-charcoal group-hover:bg-brand-gold/90"
                  : "bg-zo-bg-light text-brand-charcoal group-hover:bg-brand-gold group-hover:text-brand-charcoal"
              }`}>
                {cta}
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-2xs text-zo-muted/60 mt-12 tracking-wide">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
