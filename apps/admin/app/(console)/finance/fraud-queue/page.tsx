import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fraud Alert Queue" };

export default function FraudQueuePage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-white">Fraud Alert Queue</h1>
      <p className="text-gray-400 text-sm">AI-flagged accounts for review. Each flag includes a confidence score and flag reason.</p>
      <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-gray-500 text-sm">Fraud flags load from /admin/finance/fraud-queue API</p>
        <p className="text-xs text-gray-600 mt-2">Actions: Dismiss · Issue Warning · Suspend · Ban</p>
      </div>
    </div>
  );
}
