import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, ClipboardList, Wallet, ArrowRight } from "lucide-react";
import { Button, Card } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Dashboard</h1>
        <p className="text-sm text-zo-muted mt-1">What do you need help with today?</p>
      </div>

      {/* Quick action */}
      <Card className="bg-gradient-to-br from-brand-charcoal to-brand-charcoal-light text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Request a new errand</h2>
            <p className="text-sm text-gray-400 mt-1">Get matched with a verified runner in under 5 minutes</p>
          </div>
          <Button variant="primary" size="md" asChild>
            <Link href="/post-errand">
              <PlusCircle className="h-4 w-4" />
              Request
            </Link>
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Errands", value: "—", icon: ClipboardList, href: "/tasks" },
          { label: "Active Tasks", value: "—", icon: ArrowRight, href: "/tasks?status=active" },
          { label: "Wallet Balance", value: "₦0.00", icon: Wallet, href: "/wallet" },
          { label: "Cashback Earned", value: "₦0.00", icon: Wallet, href: "/wallet" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card hover padding="sm" className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zo-muted">{label}</p>
                  <p className="mt-1 font-display text-xl font-bold text-brand-charcoal">{value}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/10">
                  <Icon className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent tasks */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-brand-charcoal">Recent Errands</h2>
          <Link href="/tasks" className="text-sm text-brand-gold hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex flex-col items-center py-10 text-center">
          <ClipboardList className="h-10 w-10 text-zo-border mb-3" aria-hidden="true" />
          <p className="text-sm font-semibold text-brand-charcoal">No errands yet</p>
          <p className="text-xs text-zo-muted mt-1">Your completed and active errands will appear here</p>
          <Button variant="primary" size="sm" className="mt-4" asChild>
            <Link href="/post-errand">Request your first errand</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
