"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Shield, Zap, Star, ArrowRight, Play,
  ListChecks, DollarSign, Wifi, Clock,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const CUSTOMER_FEATURES = [
  { icon: MapPin, title: "Real-time GPS tracking", desc: "Watch your runner move on a live map — 5-second refresh with turn-by-turn ETA." },
  { icon: Shield, title: "Escrow-protected payments", desc: "Your money stays locked until you confirm the errand is complete. Zero risk." },
  { icon: Zap, title: "Instant or scheduled", desc: "Need it now? Post instantly. Planning ahead? Book up to 7 days in advance." },
];

const RUNNER_FEATURES = [
  { icon: ListChecks, title: "Browse tasks near you", desc: "See errands posted in your area and pick the ones that suit your schedule." },
  { icon: DollarSign, title: "Same-day bank payout", desc: "Earnings hit your Nigerian bank account within hours of task completion." },
  { icon: Wifi, title: "Go online when you want", desc: "Toggle availability with one tap. Work mornings, evenings — entirely your call." },
  { icon: Clock, title: "Top-rated bonus tier", desc: "Maintain a 4.7+ rating and unlock 15% task bonuses and priority matching." },
];

const CUSTOMER_IMG = "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?w=800&h=600&fit=crop&auto=format&q=80";
const RUNNER_IMG   = "https://images.unsplash.com/photo-1767895655081-6748c12f8aeb?w=800&h=600&fit=crop&auto=format&q=80";

export function AppExperienceTabs() {
  const [tab, setTab] = React.useState<"customer" | "runner">("customer");
  const isCustomer = tab === "customer";

  return (
    <section className="py-28">
      <div className="container-max section-padding">

        {/* Section label + heading */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">Built for everyone</p>
          <h2 className="font-display text-3xl font-extrabold text-brand-charcoal md:text-4xl tracking-tight">
            Everything you need, in one tap
          </h2>
          <p className="mt-3 text-zo-muted max-w-lg mx-auto">
            Whether you&apos;re delegating errands or earning by completing them, ZoomOff Errands has you covered.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center rounded-2xl border border-zo-border bg-zo-bg-light p-1.5 shadow-card">
            <button
              onClick={() => setTab("customer")}
              className={cn(
                "rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200",
                isCustomer
                  ? "bg-brand-charcoal text-white shadow-sm"
                  : "text-zo-muted hover:text-brand-charcoal"
              )}
            >
              I need errands done
            </button>
            <button
              onClick={() => setTab("runner")}
              className={cn(
                "rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200",
                !isCustomer
                  ? "bg-brand-gold text-brand-charcoal shadow-sm"
                  : "text-zo-muted hover:text-brand-charcoal"
              )}
            >
              I want to earn as a Runner
            </button>
          </div>
        </div>

        {/* Content grid — slides between tabs */}
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

          {/* Left: image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] max-w-sm mx-auto">
              <Image
                src={isCustomer ? CUSTOMER_IMG : RUNNER_IMG}
                alt={isCustomer ? "Person using ZoomOff Errands on their phone" : "ZoomOff Errands runner on a motorcycle"}
                fill
                className="object-cover object-top transition-opacity duration-500"
                sizes="(max-width: 1024px) 80vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>

            {/* Floating card — top right */}
            <div className="absolute -right-4 top-10 rounded-2xl bg-white p-4 shadow-card-hover flex items-center gap-3 border border-zo-border">
              {isCustomer ? (
                <div className="flex flex-col">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-brand-charcoal mt-1">4.9 / 5.0</p>
                  <p className="text-2xs text-zo-muted">2,400+ reviews</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  <p className="text-2xs text-zo-muted">This week</p>
                  <p className="font-display text-lg font-extrabold text-brand-gold tracking-tight">₦52,500</p>
                  <p className="text-2xs text-zo-muted">15 tasks completed</p>
                </div>
              )}
            </div>

            {/* Floating card — bottom left */}
            <div className="absolute -left-4 bottom-16 rounded-2xl bg-brand-charcoal p-4 shadow-card-hover">
              {isCustomer ? (
                <>
                  <Zap className="h-5 w-5 text-brand-gold mb-1.5" aria-hidden="true" />
                  <p className="text-xs font-medium text-gray-400">Matched in</p>
                  <p className="font-display text-xl font-extrabold text-brand-gold tracking-tight">4.2 min</p>
                </>
              ) : (
                <>
                  <DollarSign className="h-5 w-5 text-brand-gold mb-1.5" aria-hidden="true" />
                  <p className="text-xs font-medium text-gray-400">Avg per task</p>
                  <p className="font-display text-xl font-extrabold text-brand-gold tracking-tight">₦3,500+</p>
                </>
              )}
            </div>
          </div>

          {/* Right: copy */}
          <div className="order-1 lg:order-2">
            {isCustomer ? (
              <>
                <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">For customers</p>
                <h3 className="font-display text-2xl font-extrabold text-brand-charcoal md:text-3xl tracking-tight text-balance">
                  Your personal assistant, on demand
                </h3>
                <p className="mt-4 text-zo-muted leading-relaxed">
                  Post errands, track your runner on a live map, chat in real time, pay securely, and rate your experience — all from a single platform built for Nigeria.
                </p>
                <ul className="mt-8 space-y-5">
                  {CUSTOMER_FEATURES.map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold text-brand-charcoal text-sm">{title}</p>
                        <p className="text-xs text-zo-muted mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex gap-3 flex-wrap">
                  <Button variant="primary" size="lg" asChild>
                    <Link href="/delegate">Delegate an Errand Free</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/how-it-works" className="flex items-center gap-2">
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                      See how it works
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">For runners</p>
                <h3 className="font-display text-2xl font-extrabold text-brand-charcoal md:text-3xl tracking-tight text-balance">
                  Turn your time into real income
                </h3>
                <p className="mt-4 text-zo-muted leading-relaxed">
                  Join thousands of Nigerians earning on their own schedule. Accept the tasks you want, get paid same-day, and build your rating for bigger bonuses.
                </p>
                <ul className="mt-8 space-y-5">
                  {RUNNER_FEATURES.map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold text-brand-charcoal text-sm">{title}</p>
                        <p className="text-xs text-zo-muted mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex gap-3 flex-wrap">
                  <Button variant="primary" size="lg" asChild>
                    <Link href="/runner-apply">
                      Apply as a Runner
                      <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/become-a-runner">Learn more</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
