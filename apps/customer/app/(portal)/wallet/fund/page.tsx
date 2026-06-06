"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, useToast } from "@zoomoff/ui";
import { paymentsApi } from "@zoomoff/api-client";
import { useAuthStore } from "@zoomoff/auth";
import { openPaystackModal, generateRef, toKobo } from "@/lib/paystack";
import Link from "next/link";

const QUICK_AMOUNTS = [1000, 2500, 5000, 10000, 20000];

export default function FundWalletPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [amount, setAmount] = React.useState("");
  const numAmount = parseInt(amount) || 0;

  const { mutate: initiateTopUp, isPending } = useMutation({
    mutationFn: () => paymentsApi.fundWallet({ amount: numAmount, method: "card" }),
    onSuccess: async (res) => {
      await openPaystackModal({
        key: process.env["NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"] ?? "",
        email: user?.email ?? "",
        amount: toKobo(numAmount),
        ref: res.paystackReference ?? generateRef(),
        callback: () => {
          toast({ type: "success", title: "Wallet funded!", description: `₦${numAmount.toLocaleString()} added.` });
          window.location.href = "/wallet";
        },
        onClose: () => {},
      });
    },
    onError: () => toast({ type: "error", title: "Could not initiate payment" }),
  });

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Link href="/wallet" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal">
        <ArrowLeft className="h-4 w-4" /> Back to Wallet
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Fund Wallet</h1>
        <p className="text-sm text-zo-muted mt-1">Minimum ₦500. Funds available instantly.</p>
      </div>

      <div className="rounded-2xl border border-zo-border bg-white p-6 shadow-card space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-brand-charcoal">Quick amounts</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  numAmount === a
                    ? "border-brand-gold bg-brand-gold/10 text-brand-charcoal"
                    : "border-zo-border text-zo-muted hover:border-brand-charcoal"
                }`}
              >
                ₦{a.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Or enter amount"
          type="number"
          min={500}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          leftElement={<span className="text-sm font-semibold text-brand-charcoal">₦</span>}
          helperText="Minimum ₦500"
        />

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={numAmount < 500}
          loading={isPending}
          onClick={() => initiateTopUp()}
        >
          Pay ₦{numAmount > 0 ? numAmount.toLocaleString() : "0"} via Card
        </Button>
      </div>
    </div>
  );
}
