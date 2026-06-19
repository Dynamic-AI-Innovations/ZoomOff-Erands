"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users, Bike, Building2, Copy, Check, MessageCircle,
  Twitter, TrendingUp, CheckCircle, Clock, UserPlus,
  ArrowRight, Gift,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { getMyRefCode, buildShareUrl } from "@/lib/referral";

type ShareType = "customer" | "runner" | "business";

const TABS: { key: ShareType; icon: typeof Users; label: string; reward: string; detail: string }[] = [
  { key: "customer", icon: Users,     label: "Customer",  reward: "₦500",   detail: "per customer whose first errand completes" },
  { key: "runner",   icon: Bike,      label: "Runner",    reward: "₦2,000", detail: "per runner who completes 10 tasks" },
  { key: "business", icon: Building2, label: "Business",  reward: "₦5,000", detail: "per business that posts 5 tasks" },
];

const ACTIVITY = [
  { name: "Emeka N.",    type: "runner"   as ShareType, status: "pending",  amount: 2000, date: "1 day ago",    note: "4 tasks to go" },
  { name: "Adaeze O.",   type: "customer" as ShareType, status: "earned",   amount: 500,  date: "3 days ago",   note: "" },
  { name: "GTech Ltd.",  type: "business" as ShareType, status: "earned",   amount: 5000, date: "1 week ago",   note: "" },
  { name: "Chidi B.",    type: "customer" as ShareType, status: "signed_up",amount: 500,  date: "2 weeks ago",  note: "Awaiting first errand" },
];

const TYPE_ICON: Record<ShareType, typeof Users> = { customer: Users, runner: Bike, business: Building2 };

const STATUS_MAP = {
  earned:   { label: "Credit earned",  class: "bg-green-100 text-green-700" },
  pending:  { label: "In progress",    class: "bg-yellow-100 text-yellow-700" },
  signed_up:{ label: "Signed up",      class: "bg-blue-100 text-blue-700" },
};

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Legacy fallback
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  }
}

export function InviteDashboard() {
  const [myCode, setMyCode]    = React.useState("ZO-······");
  const [tab, setTab]          = React.useState<ShareType>("customer");
  const [copied, setCopied]    = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    const code = getMyRefCode();
    setMyCode(code);
    setShareUrl(buildShareUrl(code, tab));
  }, []);

  React.useEffect(() => {
    if (myCode !== "ZO-······") setShareUrl(buildShareUrl(myCode, tab));
  }, [tab, myCode]);

  async function handleCopy() {
    const ok = await copyToClipboard(shareUrl);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2200); }
  }

  const currentTab = TABS.find(t => t.key === tab)!;
  const whatsappMsg = encodeURIComponent(`Hey! I use ZoomOff Errands for fast, trusted errands in Nigeria. Use my referral link to sign up and we both earn rewards: ${shareUrl}`);
  const tweetMsg    = encodeURIComponent(`I use @ZoomOff ErrandsNG for fast errands — you should too! Sign up via my link and we both earn: `);

  return (
    <div className="py-12">
      <div className="container-max section-padding max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-2">Referral Hub</p>
          <h1 className="font-display text-3xl font-extrabold text-brand-charcoal tracking-tight md:text-4xl">Your Invite Dashboard</h1>
          <p className="mt-2 text-zo-muted">Share your link. Track your earnings. No cap on rewards.</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-10">
          {[
            { icon: UserPlus,   label: "Total Invited",        val: "7",      gold: false },
            { icon: Clock,      label: "Pending Milestones",   val: "3",      gold: false },
            { icon: CheckCircle,label: "Milestones Hit",       val: "2",      gold: false },
            { icon: TrendingUp, label: "Total Earned",         val: "₦5,500", gold: true  },
          ].map(({ icon: Icon, label, val, gold }) => (
            <div key={label} className="rounded-2xl border border-zo-border bg-white shadow-card p-5">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full mb-3", gold ? "bg-brand-gold/15 text-brand-gold" : "bg-zo-bg-light text-zo-muted")}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className={cn("font-display text-2xl font-extrabold tracking-tight", gold ? "text-brand-gold" : "text-brand-charcoal")}>{val}</p>
              <p className="text-xs text-zo-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: share card (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Tab selector */}
            <div className="rounded-2xl border border-zo-border bg-white shadow-card p-1.5 flex gap-1">
              {TABS.map(({ key, icon: Icon, label, reward }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-xs font-semibold transition-all duration-200",
                    tab === key ? "bg-brand-charcoal text-white shadow-sm" : "text-zo-muted hover:text-brand-charcoal"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{label}</span>
                  <span className={cn("font-bold text-xs", tab === key ? "text-brand-gold" : "text-brand-gold/60")}>{reward}</span>
                </button>
              ))}
            </div>

            {/* Reward context */}
            <div className="flex items-center gap-3 rounded-xl border border-brand-gold/30 bg-brand-gold/5 px-4 py-3">
              <Gift className="h-5 w-5 text-brand-gold shrink-0" aria-hidden="true" />
              <p className="text-sm text-brand-charcoal">
                <span className="font-bold text-brand-gold">{currentTab.reward}</span>{" "}
                {currentTab.detail}
              </p>
            </div>

            {/* Link card */}
            <div className="rounded-2xl border border-zo-border bg-white shadow-card p-6 space-y-4">
              <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">Your {currentTab.label} Referral Link</p>

              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 h-11 rounded-xl border border-zo-border bg-zo-bg-light px-3 text-sm text-brand-charcoal font-mono truncate focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
                    copied ? "bg-green-100 text-green-600" : "bg-brand-gold text-brand-charcoal hover:bg-brand-gold/90"
                  )}
                  aria-label="Copy link"
                >
                  {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>

              {copied && <p className="text-xs text-green-600 font-semibold">Link copied to clipboard!</p>}

              <div className="flex gap-3 pt-1">
                <a
                  href={`https://wa.me/?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zo-border bg-zo-bg-light py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${tweetMsg}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zo-border bg-zo-bg-light py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-all"
                >
                  <Twitter className="h-4 w-4" aria-hidden="true" />
                  Twitter / X
                </a>
              </div>
            </div>

            {/* Code display */}
            <div className="rounded-xl border border-zo-border bg-zo-bg-light px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-zo-muted">Your referral code</p>
                <p className="font-mono font-bold text-brand-charcoal tracking-wider">{myCode}</p>
              </div>
              <Link href="/referral" className="text-xs font-semibold text-brand-gold hover:underline">
                Programme rules →
              </Link>
            </div>
          </div>

          {/* Right: activity (2 cols) */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-lg font-bold text-brand-charcoal mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {ACTIVITY.map((item, i) => {
                const Icon = TYPE_ICON[item.type];
                const status = STATUS_MAP[item.status as keyof typeof STATUS_MAP];
                return (
                  <div key={i} className="rounded-2xl border border-zo-border bg-white p-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zo-bg-light text-zo-muted">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-brand-charcoal">{item.name}</p>
                        {item.status === "earned" && (
                          <p className="font-bold text-brand-gold text-sm">+₦{item.amount.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("rounded-full px-2 py-0.5 text-2xs font-semibold", status.class)}>
                          {status.label}
                        </span>
                        <span className="text-2xs text-zo-muted">{item.date}</span>
                      </div>
                      {item.note && <p className="text-2xs text-zo-muted mt-1">{item.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-zo-border bg-zo-bg-light p-4 text-center">
              <p className="text-xs text-zo-muted">Invite more people to grow your earnings.</p>
              <Button variant="primary" size="md" className="mt-3 w-full" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy Your Link"}
                <Copy className="h-4 w-4 ml-1.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
