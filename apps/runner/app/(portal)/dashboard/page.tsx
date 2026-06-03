import type { Metadata } from "next";
import Link from "next/link";
import { ListChecks, DollarSign, Star, TrendingUp } from "lucide-react";
import { Card, Button, Badge } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Runner Dashboard" };

export default function RunnerDashboardPage() {
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-brand-charcoal">Dashboard</h1>
        <Badge variant="muted" dot>Offline</Badge>
      </div>

      {/* KYC prompt (shown until approved) */}
      <Card className="border-brand-gold bg-brand-gold/5">
        <h2 className="font-semibold text-brand-charcoal text-sm">Complete your KYC</h2>
        <p className="text-xs text-zo-muted mt-1">Submit your ID, NIN, and BVN to start accepting tasks.</p>
        <Button variant="primary" size="sm" className="mt-3" asChild>
          <Link href="/profile/kyc">Continue KYC →</Link>
        </Button>
      </Card>

      {/* Today's stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Today's Earnings", value: "₦0", icon: DollarSign },
          { label: "Tasks Today", value: "0", icon: ListChecks },
          { label: "Your Rating", value: "—", icon: Star },
          { label: "Completion Rate", value: "—", icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} padding="sm">
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gold/10">
                <Icon className="h-4 w-4 text-brand-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-zo-muted">{label}</p>
                <p className="font-display text-lg font-bold text-brand-charcoal">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="secondary" size="lg" className="w-full" asChild>
        <Link href="/tasks/feed">View Available Tasks</Link>
      </Button>
    </div>
  );
}
