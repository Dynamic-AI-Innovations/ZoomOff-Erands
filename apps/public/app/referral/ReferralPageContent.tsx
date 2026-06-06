"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users, Bike, Building2, ArrowRight, Copy, ChevronDown,
  CheckCircle, Gift, Zap, BarChart3,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const TRACKS = [
  {
    icon: Users,
    label: "Refer Friends",
    track: "Customer",
    yourReward: "₦500",
    theirReward: "₦500",
    trigger: "First completed errand",
    steps: ["Share your customer link", "Friend signs up & posts an errand", "First errand completes → both earn ₦500"],
    accent: true,
    href: "/referral/invite",
    type: "customer" as const,
  },
  {
    icon: Bike,
    label: "Refer Runners",
    track: "Runner",
    yourReward: "₦2,000",
    theirReward: "First-task bonus",
    trigger: "Runner completes 10 tasks",
    steps: ["Share your runner link", "Runner applies & gets approved", "Runner hits 10 tasks → you earn ₦2,000"],
    accent: false,
    href: "/referral/invite",
    type: "runner" as const,
  },
  {
    icon: Building2,
    label: "Refer Businesses",
    track: "Business",
    yourReward: "₦5,000",
    theirReward: "₦2,000",
    trigger: "Business posts 5 tasks",
    steps: ["Share your business link", "Company starts a free trial", "5 tasks posted → ₦5,000 credit hits"],
    accent: false,
    href: "/referral/invite",
    type: "business" as const,
  },
];

const FAQ_ITEMS = [
  { q: "When do I receive my credit?", a: "Credits are added to your ZoomOff wallet automatically once the milestone is reached. You'll receive an in-app notification and an email." },
  { q: "Is there a limit on how many people I can refer?", a: "No limit at all. Refer 1 friend or 1,000 — every valid referral that hits the milestone earns you the full reward." },
  { q: "What if my referral doesn't use my link?", a: "Referrals must sign up via your unique link for the reward to be tracked. Ask them to use the link directly — you can also share via WhatsApp to make it easy." },
  { q: "How long is a referral link valid?", a: "Referral links don't expire. However, the referral credit must be claimed within 90 days of the referred user signing up." },
  { q: "Can I refer both friends and runners?", a: "Absolutely. You have three separate links — one for each track (customer, runner, business). Each link tracks separately and you earn the reward for each category independently." },
  { q: "Where do I see my earnings and referral history?", a: "Visit /referral/invite to see your full referral dashboard — total invited, milestones hit, total earned, and recent activity." },
];

function Accordion() {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="rounded-xl border border-zo-border bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="font-semibold text-brand-charcoal text-sm pr-4">{item.q}</span>
            <ChevronDown className={cn("h-4 w-4 text-zo-muted shrink-0 transition-transform duration-200", open === i && "rotate-180")} aria-hidden="true" />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-zo-muted leading-relaxed border-t border-zo-border pt-3">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ReferralPageContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-charcoal py-20">
        <div className="container-max section-padding text-center">
          <span className="inline-block rounded-full bg-brand-gold/20 border border-brand-gold/40 px-4 py-1.5 text-xs font-bold text-brand-gold uppercase tracking-widest mb-6">
            Referral Programme
          </span>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl tracking-tight text-balance">
            Earn real money by <span className="text-brand-gold">sharing ZoomOff</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-300 text-balance">
            Share your unique link. Friends sign up. Milestones trigger. Cash hits your wallet. No cap on earnings.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="xl" variant="primary" asChild>
              <Link href="/referral/invite">
                Get Your Referral Link <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
            {[
              { val: "₦500", label: "Per customer referred" },
              { val: "₦2,000", label: "Per runner referred" },
              { val: "₦5,000", label: "Per business referred" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-extrabold text-brand-gold tracking-tight">{val}</p>
                <p className="text-sm text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three tracks */}
      <section className="py-20">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-3">Choose your track</p>
            <h2 className="font-display text-3xl font-extrabold text-brand-charcoal tracking-tight">Three ways to earn</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TRACKS.map(({ icon: Icon, label, track, yourReward, theirReward, trigger, steps, accent, href }) => (
              <div
                key={track}
                className={cn(
                  "rounded-2xl border-2 p-7 flex flex-col",
                  accent ? "border-brand-gold bg-brand-gold/5 ring-2 ring-brand-gold/30" : "border-zo-border bg-white"
                )}
              >
                {accent && (
                  <span className="inline-block self-start rounded-full bg-brand-gold text-brand-charcoal text-2xs font-bold uppercase tracking-widest px-3 py-1 mb-4">
                    Most Popular
                  </span>
                )}
                <div className={cn("flex h-14 w-14 items-center justify-center rounded-full mb-5", accent ? "bg-brand-gold/20 text-brand-gold" : "bg-zo-bg-light text-zo-muted")}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-1">{track} Track</p>
                <h3 className="font-display text-xl font-extrabold text-brand-charcoal tracking-tight mb-2">{label}</h3>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="rounded-xl bg-zo-bg-light p-3 text-center">
                    <p className="text-2xs text-zo-muted uppercase tracking-widest">You earn</p>
                    <p className="font-display text-xl font-extrabold text-brand-gold mt-1">{yourReward}</p>
                  </div>
                  <div className="rounded-xl bg-zo-bg-light p-3 text-center">
                    <p className="text-2xs text-zo-muted uppercase tracking-widest">They get</p>
                    <p className="font-display text-xl font-extrabold text-brand-charcoal mt-1">{theirReward}</p>
                  </div>
                </div>

                <p className="text-xs text-zo-muted mb-4">
                  <span className="font-semibold text-brand-charcoal">Trigger:</span> {trigger}
                </p>

                <ol className="space-y-2 flex-1 mb-6">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zo-muted">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold font-bold text-2xs">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>

                <Link
                  href={href}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
                    accent ? "bg-brand-gold text-brand-charcoal hover:bg-brand-gold/90" : "bg-zo-bg-light text-brand-charcoal hover:bg-brand-gold hover:text-brand-charcoal"
                  )}
                >
                  Get Your Link <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-zo-bg-light py-20">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-3">Simple process</p>
            <h2 className="font-display text-3xl font-extrabold text-brand-charcoal tracking-tight">How it works</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            {[
              { n: 1, icon: Copy,        title: "Copy your link",       desc: "Visit the invite page and copy your unique referral link." },
              { n: 2, icon: Users,       title: "Share it",             desc: "Send via WhatsApp, Twitter, email, or anywhere." },
              { n: 3, icon: CheckCircle, title: "They sign up",         desc: "Your contact creates an account using your link." },
              { n: 4, icon: Zap,         title: "Milestone hit",        desc: "They complete their first errand, task, or order." },
              { n: 5, icon: Gift,        title: "Credit lands",         desc: "Your reward hits your ZoomOff wallet automatically." },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border-2 border-brand-gold/30 mx-auto mb-4 shadow-card">
                  <Icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                </div>
                <p className="font-display text-xs font-bold text-brand-gold uppercase tracking-widest mb-1">Step {n}</p>
                <p className="font-semibold text-brand-charcoal text-sm mb-1">{title}</p>
                <p className="text-xs text-zo-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards table */}
      <section className="py-20">
        <div className="container-max section-padding">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold text-brand-charcoal tracking-tight">Full rewards breakdown</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-zo-border bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-zo-bg-light">
                <tr>
                  {["Who you refer", "Your reward", "Their reward", "Trigger event"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zo-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zo-border">
                <tr className="bg-brand-gold/5 hover:bg-brand-gold/10 transition-colors">
                  <td className="px-5 py-4"><span className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-gold" />Customer friend</span></td>
                  <td className="px-5 py-4 font-bold text-brand-gold">₦500</td>
                  <td className="px-5 py-4 text-zo-muted">₦500 credit</td>
                  <td className="px-5 py-4 text-zo-muted">First completed errand</td>
                </tr>
                <tr className="hover:bg-zo-bg-light transition-colors">
                  <td className="px-5 py-4"><span className="flex items-center gap-2"><Bike className="h-4 w-4 text-brand-charcoal" />Runner</span></td>
                  <td className="px-5 py-4 font-bold text-brand-gold">₦2,000</td>
                  <td className="px-5 py-4 text-zo-muted">First-task bonus</td>
                  <td className="px-5 py-4 text-zo-muted">Runner completes 10 tasks</td>
                </tr>
                <tr className="hover:bg-zo-bg-light transition-colors">
                  <td className="px-5 py-4"><span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-zo-info" />Business</span></td>
                  <td className="px-5 py-4 font-bold text-brand-gold">₦5,000</td>
                  <td className="px-5 py-4 text-zo-muted">₦2,000 credit</td>
                  <td className="px-5 py-4 text-zo-muted">Business posts 5 tasks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-zo-bg-light py-20">
        <div className="container-max section-padding max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold text-brand-charcoal tracking-tight">Frequently asked</h2>
          </div>
          <Accordion />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-charcoal py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent pointer-events-none" />
        <div className="container-max section-padding text-center relative">
          <BarChart3 className="h-10 w-10 text-brand-gold mx-auto mb-5" aria-hidden="true" />
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">Ready to start earning?</h2>
          <p className="mt-3 text-gray-400 max-w-md mx-auto">Copy your referral link and share it. Every sign-up gets you closer to the next credit.</p>
          <Button size="xl" variant="primary" className="mt-8" asChild>
            <Link href="/referral/invite">
              Go to Your Invite Dashboard <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
