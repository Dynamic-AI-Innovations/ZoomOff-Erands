"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight, Zap, Shield, Star } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { saveRef, REF_REGEX } from "@/lib/referral";

const REWARD_MAP = {
  customer: {
    badge: "You've been invited!",
    headline: "Get ₦500 credit",
    detail: "Sign up free and get ₦500 credited to your wallet after your first completed errand.",
    cta: "Claim Your ₦500 Credit",
    ctaHref: "/register",
    alt: "Learn how it works",
    altHref: "/how-it-works",
    color: "bg-brand-gold/15 border-brand-gold/40 text-brand-gold",
  },
  runner: {
    badge: "Earn as a Runner",
    headline: "Start earning today",
    detail: "Join as a ZoomOff Errands runner. Your referrer earns ₦2,000 when you complete your first 10 tasks — and you keep all your earnings.",
    cta: "Apply as a Runner",
    ctaHref: "/runner-apply",
    alt: "See runner earnings",
    altHref: "/become-a-runner",
    color: "bg-brand-charcoal/15 border-brand-charcoal/40 text-brand-charcoal",
  },
  business: {
    badge: "For Businesses",
    headline: "Get ₦5,000 credit",
    detail: "Set up your business account and get ₦5,000 credited after your first 5 tasks. Your referrer also earns a bonus.",
    cta: "Start Free Business Trial",
    ctaHref: "/business-register",
    alt: "See business features",
    altHref: "/business",
    color: "bg-zo-info/10 border-zo-info/40 text-zo-info",
  },
};

const TRUST_POINTS = [
  { icon: Zap, label: "Matched in under 5 minutes" },
  { icon: Shield, label: "Escrow-protected payments" },
  { icon: Star, label: "4.9/5 from 2,400+ reviews" },
];

export function JoinContent() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<"customer" | "runner" | "business">("customer");
  const [code, setCode] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refParam  = searchParams.get("ref");
    const typeParam = (searchParams.get("type") as typeof type) ?? "customer";
    const validType = ["customer", "runner", "business"].includes(typeParam) ? typeParam : "customer";
    setType(validType as typeof type);
    if (refParam && REF_REGEX.test(refParam)) {
      setCode(refParam);
      saveRef(refParam, validType);
      setSaved(true);
    }
  }, [searchParams]);

  const reward = REWARD_MAP[type];

  return (
    <div className="min-h-screen bg-zo-bg-dark flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="container-max section-padding flex h-16 items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Already a member? <span className="text-brand-gold font-semibold">Log in</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Referral badge */}
          <div className="text-center mb-8">
            <span className="inline-block rounded-full bg-brand-gold/15 border border-brand-gold/40 px-4 py-1.5 text-xs font-bold text-brand-gold uppercase tracking-widest mb-6">
              {reward.badge}
            </span>
            <h1 className="font-display text-4xl font-extrabold text-white tracking-tight text-balance">
              {reward.headline}
            </h1>
            <p className="mt-3 text-gray-400 leading-relaxed max-w-sm mx-auto">
              {reward.detail}
            </p>
          </div>

          {/* Reward card */}
          <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-5 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-white text-sm">Referral credit applied automatically</p>
                <p className="text-xs text-gray-400 mt-0.5">No promo code needed. The reward triggers automatically when you sign up with this link.</p>
                {code && (
                  <p className="text-xs text-gray-500 mt-2">
                    Referral code: <span className="font-mono text-brand-gold">{code}</span>
                    {saved && <span className="ml-2 text-green-400">✓ Saved</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mb-8">
            <Button variant="primary" size="xl" className="w-full" asChild>
              <Link href={reward.ctaHref}>
                {reward.cta}
                <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
              <Link href={reward.altHref}>{reward.alt}</Link>
            </Button>
          </div>

          {/* Trust points */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-xs font-semibold text-gray-500 text-center uppercase tracking-widest mb-4">Why ZoomOff Errands</p>
            <div className="flex flex-col gap-3">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-brand-gold shrink-0">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-2xs text-gray-700 mt-8 tracking-wide">
            Powered by <span className="text-brand-gold/60">Dynamics Technology</span>
          </p>
        </div>
      </div>
    </div>
  );
}
