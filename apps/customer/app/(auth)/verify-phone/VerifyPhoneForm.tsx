"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button, OTPInput, useToast } from "@zoomoff/ui";
import { authApi } from "@zoomoff/api-client";

export function VerifyPhoneForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const phone = params.get("phone") ?? "";
  const [otp, setOtp] = React.useState("");
  const [countdown, setCountdown] = React.useState(60);

  React.useEffect(() => {
    if (countdown === 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const { mutate: verify, isPending } = useMutation({
    mutationFn: () => authApi.verifyPhone({ phone, otp }),
    onSuccess: () => {
      toast({ type: "success", title: "Phone verified!", description: "Your account is now active." });
      router.replace("/dashboard");
    },
    onError: () => {
      toast({ type: "error", title: "Invalid OTP", description: "The code is incorrect or has expired." });
    },
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: () => authApi.resendOtp({ phone }),
    onSuccess: () => {
      setCountdown(60);
      setOtp("");
      toast({ type: "info", title: "Code resent", description: `A new code was sent to ${phone}.` });
    },
  });

  return (
    <div className="rounded-2xl border border-zo-border bg-white p-8 shadow-card text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gold/10 mx-auto mb-6">
        <span className="text-3xl">📱</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-brand-charcoal">Verify your phone</h1>
      <p className="mt-2 text-sm text-zo-muted">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-brand-charcoal">{phone}</span>. Expires in 5 minutes.
      </p>
      <div className="my-8 flex justify-center">
        <OTPInput length={6} value={otp} onChange={setOtp} autoFocus disabled={isPending} />
      </div>
      <Button variant="primary" size="lg" className="w-full" loading={isPending} disabled={otp.length < 6} onClick={() => verify()}>
        Verify Phone
      </Button>
      <div className="mt-4">
        {countdown > 0 ? (
          <p className="text-sm text-zo-muted">Resend code in <span className="font-semibold text-brand-charcoal">{countdown}s</span></p>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => resend()} loading={isResending}>Resend code</Button>
        )}
      </div>
    </div>
  );
}
