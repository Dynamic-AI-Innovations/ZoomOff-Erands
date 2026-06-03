import type { Metadata } from "next";
import { Activity, Users, DollarSign, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Operations Dashboard" };

const KPI_CARDS = [
  { label: "Tasks Today", value: "—", icon: Activity, delta: null },
  { label: "Completion Rate", value: "—%", icon: CheckCircle2, delta: null },
  { label: "Avg Assignment Time", value: "—", icon: Clock, delta: null },
  { label: "Active Customers", value: "—", icon: Users, delta: null },
  { label: "GMV Today", value: "₦—", icon: DollarSign, delta: null },
  { label: "Open Disputes", value: "—", icon: AlertTriangle, delta: null },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Operations Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time platform metrics — updates live via WebSocket</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {KPI_CARDS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">{label}</p>
              <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />
            </div>
            <p className="font-display text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Alert centre */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-zo-warning" aria-hidden="true" />
            Alert Centre
          </h2>
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-sm text-gray-500">No active alerts — all clear</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "KYC Review Queue", href: "/runners/kyc-queue", count: "—" },
              { label: "Open Disputes", href: "/disputes", count: "—" },
              { label: "Fraud Flags", href: "/finance/fraud-queue", count: "—" },
              { label: "Unassigned Tasks >5min", href: "/tasks?unassigned=true", count: "—" },
            ].map(({ label, href, count }) => (
              <a key={href} href={href}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors">
                <span className="text-gray-300">{label}</span>
                <span className="font-semibold text-brand-gold">{count}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
