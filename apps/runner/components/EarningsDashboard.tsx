"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Card, Button, Badge, useToast, Input, Skeleton } from "@zoomoff/ui";
import { DollarSign, TrendingUp, Clock, Award, ArrowDownRight } from "lucide-react";

type Period = "today" | "week" | "month";

function formatNaira(n: number) { return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`; }

interface Earnings {
  available: number;
  pending: number;
  today: number;
  week: number;
  month: number;
  totalTasks: number;
  bonuses: number;
  tier: string;
  tierScore: number;
}

export function EarningsDashboard() {
  const { toast } = useToast();
  const [period, setPeriod] = React.useState<Period>("week");
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [showWithdraw, setShowWithdraw] = React.useState(false);

  const { data: earnings, isLoading } = useQuery({
    queryKey: ["runner-earnings"],
    queryFn: () => apiClient.get<{ data: Earnings }>("/runner/earnings").then(r => r.data.data),
  });

  const { mutate: withdraw, isPending: withdrawing } = useMutation({
    mutationFn: () => apiClient.post("/runner/withdraw", { amount: parseInt(withdrawAmount) }),
    onSuccess: () => {
      toast({ type: "success", title: "Withdrawal requested!", description: "Funds will be in your bank account by next business day." });
      setShowWithdraw(false);
      setWithdrawAmount("");
    },
    onError: () => toast({ type: "error", title: "Withdrawal failed", description: "Minimum ₦1,000 required." }),
  });

  if (isLoading) return <div className="p-4 space-y-3 max-w-lg mx-auto">{[1,2,3].map(i=><Skeleton key={i} height={80} className="rounded-2xl"/>)}</div>;

  const e = earnings ?? { available: 0, pending: 0, today: 0, week: 0, month: 0, totalTasks: 0, bonuses: 0, tier: "standard", tierScore: 0 };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-5">
      <h1 className="font-display text-xl font-bold text-brand-charcoal">Earnings</h1>

      {/* Available balance */}
      <Card className="bg-gradient-to-br from-brand-charcoal to-brand-charcoal-light border-0 text-white">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Available to Withdraw</p>
        <p className="font-display text-4xl font-bold text-white mt-1">{formatNaira(e.available)}</p>
        {e.pending > 0 && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{formatNaira(e.pending)} clearing</p>}
        <Button variant="primary" size="md" className="mt-4" onClick={() => setShowWithdraw(true)} disabled={e.available < 1000}>
          <ArrowDownRight className="h-4 w-4" aria-hidden="true" /> Withdraw to Bank
        </Button>
      </Card>

      {/* Period selector */}
      <div className="flex gap-2">
        {(["today","week","month"] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`flex-1 rounded-xl border py-2 text-sm font-semibold capitalize transition-colors ${period === p ? "border-brand-gold bg-brand-gold/10 text-brand-charcoal" : "border-zo-border text-zo-muted"}`}>
            {p}
          </button>
        ))}
      </div>

      {/* Earnings stat */}
      <Card className="text-center">
        <p className="text-xs text-zo-muted uppercase tracking-wide">Earned this {period}</p>
        <p className="font-display text-3xl font-bold text-brand-charcoal mt-1">{formatNaira(e[period])}</p>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Tasks Completed", value: e.totalTasks, icon: TrendingUp },
          { label: "Bonus Earnings", value: formatNaira(e.bonuses), icon: Award },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} padding="sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/10">
                <Icon className="h-4 w-4 text-brand-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-zo-muted">{label}</p>
                <p className="font-semibold text-brand-charcoal">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tier status */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-brand-charcoal">Runner Tier</h2>
          <Badge variant={e.tier === "elite" ? "gold" : e.tier === "verified" ? "info" : "muted"}>
            {e.tier.charAt(0).toUpperCase() + e.tier.slice(1)}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-zo-muted">
            <span>Tier score</span>
            <span>{e.tierScore}/100</span>
          </div>
          <div className="h-2 rounded-full bg-zo-border overflow-hidden">
            <div className="h-full rounded-full bg-brand-gold transition-all" style={{ width: `${e.tierScore}%` }} />
          </div>
          <p className="text-xs text-zo-muted">
            {e.tier !== "elite" ? `Reach ${e.tier === "standard" ? "Verified" : "Elite"} for higher commission rates` : "You're Elite! Maximum earnings unlocked."}
          </p>
        </div>
      </Card>

      {/* Withdraw modal */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-sm space-y-4">
            <h2 className="font-semibold text-brand-charcoal">Withdraw Earnings</h2>
            <p className="text-xs text-zo-muted">Available: {formatNaira(e.available)} · Minimum: ₦1,000</p>
            <Input
              label="Amount to withdraw"
              type="number"
              min={1000}
              max={e.available}
              value={withdrawAmount}
              onChange={ev => setWithdrawAmount(ev.target.value)}
              leftElement={<span className="text-sm font-semibold">₦</span>}
            />
            <p className="text-xs text-zo-muted bg-zo-info-light border border-zo-info/20 rounded-xl p-3">
              {e.tier === "elite" ? "⚡ Elite runner: Same-day settlement" : "Standard settlement: Next business day"}
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowWithdraw(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" loading={withdrawing} disabled={parseInt(withdrawAmount) < 1000} onClick={() => withdraw()}>
                Withdraw
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
