import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, BarChart3, Users, ClipboardList, ArrowRight } from "lucide-react";
import { Card, Button } from "@zoomoff/ui";
export const metadata: Metadata = { title: "Business Dashboard" };
export default function BusinessDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Business Dashboard</h1>
          <p className="text-sm text-zo-muted mt-1">Overview of your organisation's activity</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/tasks/new"><PlusCircle className="h-4 w-4" /> Post Task</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Tasks This Month", value: "—", icon: ClipboardList, href: "/tasks" },
          { label: "Total Spend", value: "₦0", icon: BarChart3, href: "/analytics/spend" },
          { label: "Team Members", value: "—", icon: Users, href: "/team" },
          { label: "Pending Approvals", value: "—", icon: ClipboardList, href: "/tasks/approvals" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card hover padding="sm">
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
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-brand-charcoal">Live Task Board</h2>
          <Link href="/tasks" className="text-sm text-brand-gold hover:underline flex items-center gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="flex flex-col items-center py-10 text-center">
          <ClipboardList className="h-10 w-10 text-zo-border mb-3" aria-hidden="true" />
          <p className="text-sm font-semibold text-brand-charcoal">No tasks yet</p>
          <p className="text-xs text-zo-muted mt-1">Post your first task or invite team members to get started</p>
          <div className="mt-4 flex gap-3">
            <Button variant="primary" size="sm" asChild><Link href="/tasks/new">Post a Task</Link></Button>
            <Button variant="outline" size="sm" asChild><Link href="/team/invite">Invite Team</Link></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
