"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "@zoomoff/api-client";
import { Card, Button, Badge, Skeleton } from "@zoomoff/ui";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, TrendingUp } from "lucide-react";
import type { Payment } from "@zoomoff/api-client";

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
}

const TX_ICON: Record<string, React.ElementType> = {
  payment: ArrowUpRight,
  top_up: ArrowDownLeft,
  refund: ArrowDownLeft,
  cashback: TrendingUp,
  withdrawal: ArrowUpRight,
};

export function WalletView() {
  const { data: wallet, isLoading: wLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => paymentsApi.getWallet(),
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => paymentsApi.getTransactions({ page: 1, pageSize: 20 }),
  });

  const transactions = txData?.data ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Wallet</h1>
        <p className="text-sm text-zo-muted mt-1">Manage your ZoomOff balance and transaction history</p>
      </div>

      {/* Balance card */}
      {wLoading ? (
        <Skeleton height={120} className="rounded-2xl" />
      ) : (
        <Card className="bg-gradient-to-br from-brand-charcoal to-brand-charcoal-light text-white border-0">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Available Balance</p>
              <p className="font-display text-4xl font-bold text-white mt-1">
                {formatNaira(wallet?.balance ?? 0)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <Wallet className="h-6 w-6 text-brand-gold" aria-hidden="true" />
            </div>
          </div>
          {(wallet?.pendingBalance ?? 0) > 0 && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatNaira(wallet!.pendingBalance)} in escrow
            </p>
          )}
          <div className="mt-4">
            <Button variant="primary" size="md" asChild>
              <Link href="/wallet/fund">Fund Wallet</Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Transaction history */}
      <div>
        <h2 className="font-semibold text-brand-charcoal mb-3">Transaction History</h2>

        {txLoading && (
          <div className="space-y-2">{[1,2,3,4].map(i=><Skeleton key={i} height={56} className="rounded-xl" />)}</div>
        )}

        {!txLoading && transactions.length === 0 && (
          <Card className="text-center py-10">
            <p className="text-sm text-zo-muted">No transactions yet</p>
          </Card>
        )}

        <div className="space-y-2">
          {transactions.map((tx: Payment) => {
            const isDebit = tx.method === "card" || tx.method === "bank_transfer";
            const Icon = TX_ICON[tx.method] ?? ArrowUpRight;
            return (
              <Card key={tx.id} padding="sm" className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isDebit ? "bg-zo-error-light" : "bg-zo-success-light"}`}>
                  <Icon className={`h-4 w-4 ${isDebit ? "text-zo-error" : "text-zo-success"}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-charcoal capitalize">{tx.method.replace(/_/g, " ")}</p>
                  <p className="text-xs text-zo-muted">{formatDate(tx.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isDebit ? "text-zo-error" : "text-zo-success"}`}>
                    {isDebit ? "-" : "+"}{formatNaira(tx.amount)}
                  </p>
                  <Badge variant={tx.status === "successful" ? "success" : tx.status === "pending" ? "warning" : "error"}>
                    {tx.status}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
