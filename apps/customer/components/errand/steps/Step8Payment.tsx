"use client";

import * as React from "react";
import { CreditCard, Wallet, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { Button, Card, cn, useToast } from "@zoomoff/ui";
import { useErrandStore } from "@/lib/errand-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tasksApi, paymentsApi, authApi } from "@zoomoff/api-client";
import { useAuthStore } from "@zoomoff/auth";
import { useRouter } from "next/navigation";
import { openPaystackModal, generateRef, toKobo } from "@/lib/paystack";

type PayMethod = "wallet" | "card" | "bank_transfer";

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

export function Step8Payment() {
  const { draft, updateDraft, setStep, resetDraft } = useErrandStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [method, setMethod] = React.useState<PayMethod | null>(draft.paymentMethod);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => paymentsApi.getWallet(),
  });

  const total = draft.priceEstimate?.total ?? 0;
  const walletBalance = wallet?.balance ?? 0;
  const walletShort = walletBalance < total;

  const { mutate: createTask } = useMutation({
    mutationFn: () =>
      tasksApi.create({
        category: draft.category!,
        categoryOther: draft.categoryOther || undefined,
        description: draft.description,
        specialInstructions: draft.specialInstructions || undefined,
        isUrgent: draft.isUrgent,
        pickup: draft.pickup!,
        destination: draft.destination!,
        waypoints: draft.waypoints,
        scheduleType: draft.scheduleType!,
        scheduledAt:
          draft.scheduledDate && draft.scheduledTime
            ? `${draft.scheduledDate}T${draft.scheduledTime}:00`
            : undefined,
        attachments: draft.attachments,
      }),
    onSuccess: (task) => {
      resetDraft();
      toast({ type: "success", title: "Errand posted!", description: "Finding your runner..." });
      router.push(`/tasks/${task.id}/track`);
    },
    onError: () => {
      setIsProcessing(false);
      toast({ type: "error", title: "Payment failed", description: "Please try again." });
    },
  });

  async function pay() {
    if (!method) return;
    setIsProcessing(true);
    updateDraft({ paymentMethod: method });

    if (method === "wallet") {
      createTask();
      return;
    }

    if (method === "card") {
      await openPaystackModal({
        key: process.env["NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"] ?? "",
        email: user?.email ?? "",
        amount: toKobo(total),
        ref: generateRef(),
        metadata: { draft_category: draft.category },
        callback: (res) => {
          paymentsApi.verify(res.reference).then(() => createTask()).catch(() => {
            setIsProcessing(false);
            toast({ type: "error", title: "Payment verification failed" });
          });
        },
        onClose: () => setIsProcessing(false),
      });
      return;
    }

    if (method === "bank_transfer") {
      createTask();
    }
  }

  const options: { id: PayMethod; icon: React.ElementType; label: string; sub?: string; disabled?: boolean }[] = [
    {
      id: "wallet",
      icon: Wallet,
      label: "ZoomOff Wallet",
      sub: `Balance: ${formatNaira(walletBalance)}${walletShort ? " (insufficient)" : ""}`,
      disabled: walletShort,
    },
    { id: "card", icon: CreditCard, label: "Debit / Credit Card", sub: "Visa, Mastercard, Verve" },
    { id: "bank_transfer", icon: Building2, label: "Bank Transfer", sub: "USSD or direct transfer" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-charcoal">Payment</h2>
        <p className="text-sm text-zo-muted mt-1">Choose how you want to pay</p>
      </div>

      {/* Order summary */}
      <Card className="bg-zo-bg-light border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zo-muted uppercase tracking-wide">Total to pay</p>
            <p className="font-display text-2xl font-bold text-brand-charcoal mt-0.5">
              {formatNaira(total)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zo-muted capitalize">{draft.category?.replace(/_/g, " ")}</p>
            <p className="text-xs text-zo-muted mt-0.5">{draft.scheduleType}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {options.map(({ id, icon: Icon, label, sub, disabled }) => (
          <button
            key={id}
            onClick={() => !disabled && setMethod(id)}
            disabled={disabled}
            className={cn(
              "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
              method === id && !disabled
                ? "border-brand-gold bg-brand-gold/5 ring-1 ring-brand-gold"
                : disabled
                  ? "border-zo-border bg-zo-bg-light opacity-50 cursor-not-allowed"
                  : "border-zo-border bg-white hover:border-brand-charcoal/30"
            )}
            aria-pressed={method === id}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              method === id ? "bg-brand-gold text-brand-charcoal" : "bg-zo-bg-light text-zo-muted"
            )}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-charcoal">{label}</p>
              {sub && <p className="text-xs text-zo-muted mt-0.5">{sub}</p>}
            </div>
            {method === id && (
              <CheckCircle2 className="h-5 w-5 text-brand-gold shrink-0" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <p className="text-xs text-zo-muted text-center">
        🔒 Payment held in escrow — released to runner only after you confirm completion
      </p>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(7)} disabled={isProcessing}>← Back</Button>
        <Button
          variant="primary"
          size="lg"
          disabled={!method || isProcessing}
          onClick={pay}
        >
          {isProcessing ? (
            <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Processing...</>
          ) : (
            `Confirm & Pay ${formatNaira(total)}`
          )}
        </Button>
      </div>
    </div>
  );
}
