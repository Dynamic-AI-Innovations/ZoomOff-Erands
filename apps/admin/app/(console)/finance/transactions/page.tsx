import type { Metadata } from "next";

export const metadata: Metadata = { title: "Transaction Monitor" };

export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-white">Transaction Monitor</h1>
      <p className="text-gray-400 text-sm">All payments, wallet top-ups, runner withdrawals, refunds and escrow activity.</p>
      <div className="flex gap-3 flex-wrap">
        {["All","Payments","Top-ups","Withdrawals","Refunds"].map(f => (
          <button key={f} className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-400 hover:border-brand-gold hover:text-white transition-colors first:border-brand-gold first:text-white">{f}</button>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-gray-500 text-sm">Transaction data loads from /admin/finance/transactions API</p>
      </div>
    </div>
  );
}
