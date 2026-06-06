"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button, OTPInput, useToast } from "@zoomoff/ui";
import { authApi } from "@zoomoff/api-client";
import { setAuthTokens } from "@zoomoff/auth";
import { ShieldCheck } from "lucide-react";

export function MfaVerifyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = React.useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.verifyMfa({ code }),
    onSuccess: ({ user, tokens }) => {
      setAuthTokens(tokens.accessToken, user);
      document.cookie = "zo_mfa_verified=1; path=/; SameSite=Strict";
      router.replace("/dashboard");
    },
    onError: () => {
      toast({ type: "error", title: "Invalid code", description: "Check your authenticator app and try again." });
      setCode("");
    },
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center space-y-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/20 mx-auto">
        <ShieldCheck className="h-7 w-7 text-brand-gold" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-display text-xl font-bold text-white">Two-Factor Authentication</h1>
        <p className="text-sm text-gray-400 mt-1">Enter the 6-digit code from your authenticator app</p>
      </div>
      <div className="flex justify-center">
        <OTPInput length={6} value={code} onChange={setCode} autoFocus disabled={isPending} />
      </div>
      <Button variant="primary" size="lg" className="w-full" disabled={code.length < 6} loading={isPending} onClick={() => mutate()}>
        Verify & Enter Console
      </Button>
      <p className="text-xs text-gray-600">Every admin session requires MFA — no exceptions.</p>
    </div>
  );
}
