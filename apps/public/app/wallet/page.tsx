"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, LogOut, Wallet, ArrowUpRight, ArrowDownLeft,
  Copy, CheckCheck, Info,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type WalletData = { balance: number; pending_balance: number; currency: string };
type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string | null;
  created_at: string;
};

const BANK_DETAILS = {
  bank: "First Bank Nigeria",
  account: "3098765432",
  name: "ZoomOff Errands Ltd",
  sort: "011",
};

const TYPE_LABEL: Record<string, string> = {
  top_up: "Wallet Top-up",
  payment: "Errand Payment",
  refund: "Refund",
  withdrawal: "Withdrawal",
};

const TYPE_ICON: Record<string, "in" | "out"> = {
  top_up: "in",
  refund: "in",
  payment: "out",
  withdrawal: "out",
};

export default function WalletPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [copied, setCopied] = React.useState(false);
  const [tablesMissing, setTablesMissing] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }

      const [walletRes, txRes] = await Promise.all([
        supabase.from("wallets").select("balance, pending_balance, currency").eq("user_id", session.user.id).maybeSingle(),
        supabase.from("transactions").select("id, type, amount, status, description, created_at")
          .eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(30),
      ]);

      if (walletRes.error?.code === "42P01" || txRes.error?.code === "42P01") {
        setTablesMissing(true);
      } else {
        setWallet(walletRes.data ?? { balance: 0, pending_balance: 0, currency: "NGN" });
        setTransactions(txRes.data ?? []);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  function copyAccount() {
    navigator.clipboard.writeText(BANK_DETAILS.account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zo-bg-light flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const balance = wallet?.balance ?? 0;
  const pendingBalance = wallet?.pending_balance ?? 0;
  const currency = wallet?.currency ?? "NGN";

  return (
    <div className="min-h-screen bg-zo-bg-light">
      <header className="bg-white border-b border-zo-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="font-display text-xl font-extrabold text-brand-charcoal">My Wallet</h1>

        {/* Balance card */}
        <div className="rounded-2xl bg-brand-charcoal px-6 py-7 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-4 top-12 h-20 w-20 rounded-full bg-white/5 pointer-events-none" />
          <p className="text-sm text-gray-400 mb-1">Available Balance</p>
          <p className="font-display text-4xl font-extrabold tracking-tight">
            ₦{balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
          {pendingBalance > 0 && (
            <p className="text-xs text-amber-300 mt-2 flex items-center gap-1">
              <Info className="h-3 w-3" />
              ₦{pendingBalance.toLocaleString("en-NG")} pending confirmation
            </p>
          )}
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
              <Wallet className="h-3 w-3" /> {currency} Wallet
            </span>
          </div>
        </div>

        {/* Fund wallet */}
        <div className="rounded-2xl bg-white border border-zo-border p-5">
          <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-1">Fund Your Wallet</p>
          <p className="text-sm text-zo-muted mb-4 leading-relaxed">
            Transfer to the account below. Your wallet is credited within 15–30 minutes after bank confirmation.
          </p>

          <div className="space-y-3 rounded-xl border border-zo-border bg-zo-bg-light p-4">
            {[
              { label: "Bank", value: BANK_DETAILS.bank },
              { label: "Account Name", value: BANK_DETAILS.name },
              { label: "Sort Code", value: BANK_DETAILS.sort },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <p className="text-xs text-zo-muted">{label}</p>
                <p className="text-sm font-semibold text-brand-charcoal">{value}</p>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <p className="text-xs text-zo-muted">Account Number</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-brand-charcoal font-mono tracking-widest">{BANK_DETAILS.account}</p>
                <button
                  onClick={copyAccount}
                  className="flex items-center gap-1 rounded-lg bg-brand-gold/10 px-2 py-1 text-xs font-semibold text-brand-gold hover:bg-brand-gold/20 transition-colors"
                >
                  {copied
                    ? <><CheckCheck className="h-3.5 w-3.5" /> Copied</>
                    : <><Copy className="h-3.5 w-3.5" /> Copy</>
                  }
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-zo-muted mt-3 leading-relaxed">
            Use your registered email address as the transfer narration to ensure fast wallet matching.
          </p>
        </div>

        {/* Payment gateway notice */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Card payments via Paystack and instant top-up are coming soon. For now, fund via bank transfer above.
          </p>
        </div>

        {/* Transaction history */}
        {tablesMissing ? (
          <div className="rounded-2xl border border-dashed border-zo-border bg-white p-8 text-center">
            <p className="text-sm text-zo-muted">Wallet data is being set up. Check back shortly.</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zo-border bg-white p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10 mx-auto mb-4">
              <Wallet className="h-7 w-7 text-brand-gold" />
            </div>
            <p className="font-semibold text-brand-charcoal text-sm">No transactions yet</p>
            <p className="text-xs text-zo-muted mt-1">
              Your payment history will appear here after your first transaction.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="font-display text-base font-bold text-brand-charcoal">Transaction History</h2>
            <div className="rounded-2xl bg-white border border-zo-border divide-y divide-zo-border overflow-hidden">
              {transactions.map(tx => {
                const isIn = (TYPE_ICON[tx.type] ?? "out") === "in";
                return (
                  <div key={tx.id} className="flex items-center gap-3 px-4 py-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isIn ? "bg-green-50" : "bg-red-50"}`}>
                      {isIn
                        ? <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        : <ArrowUpRight className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-charcoal">{TYPE_LABEL[tx.type] ?? tx.type}</p>
                      {tx.description && (
                        <p className="text-xs text-zo-muted truncate">{tx.description}</p>
                      )}
                      <p className="text-xs text-zo-muted/70">
                        {new Date(tx.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <p className={`text-sm font-bold shrink-0 ${isIn ? "text-green-600" : "text-red-600"}`}>
                      {isIn ? "+" : "−"}₦{tx.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-center text-2xs text-zo-muted/60 pb-4">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
