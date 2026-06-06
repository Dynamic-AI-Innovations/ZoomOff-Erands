import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Runner Management" };

export default function RunnersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Runner Management</h1>
          <p className="text-gray-400 text-sm">Approve, suspend, manage and review all runner accounts.</p>
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link href="/runners/kyc-queue">KYC Queue</Link>
        </Button>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <input type="search" placeholder="Search by name, email or phone..." className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" />
        <p className="text-xs text-gray-600 mt-4 text-center">Runner list loads from /admin/runners API</p>
      </div>
    </div>
  );
}
