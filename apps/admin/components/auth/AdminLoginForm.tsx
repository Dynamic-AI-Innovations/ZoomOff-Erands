"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button, OTPInput, useToast } from "@zoomoff/ui";
import { loginSchema, totpSchema, type LoginInput, type TotpInput } from "@zoomoff/validators";
import { authApi } from "@zoomoff/api-client";
import { setAuthTokens } from "@zoomoff/auth";

type Step = "credentials" | "mfa";

function CredentialInputs({ disabled }: { disabled?: boolean }) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">Email</label>
        <input name="identifier" type="email" autoComplete="username" disabled={disabled} placeholder="admin@zoomoff.africa"
          className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-50" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">Password</label>
        <input name="password" type="password" autoComplete="current-password" disabled={disabled} placeholder="Your password"
          className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-50" />
      </div>
    </>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = React.useState<Step>("credentials");
  const [mfaCode, setMfaCode] = React.useState("");
  const [credentials, setCredentials] = React.useState<LoginInput | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const { mutate: loginStep1, isPending: p1 } = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: ({ user }) => {
      if (!["zo_admin", "zo_super_admin"].includes(user.role)) {
        toast({ type: "error", title: "Access denied", description: "This console is for ZoomOff staff only." });
        return;
      }
      setStep("mfa");
      toast({ type: "info", title: "MFA required", description: "Open your authenticator app for the 6-digit code." });
    },
    onError: () => toast({ type: "error", title: "Invalid credentials" }),
  });

  const { mutate: verifyMfa, isPending: p2 } = useMutation({
    mutationFn: (data: { code: string }) => authApi.verifyMfa(data),
    onSuccess: ({ user, tokens }) => {
      setAuthTokens(tokens.accessToken, user);
      document.cookie = "zo_mfa_verified=1; path=/; SameSite=Strict";
      router.replace("/dashboard");
    },
    onError: () => {
      toast({ type: "error", title: "Invalid MFA code", description: "Check your authenticator and try again." });
      setMfaCode("");
    },
  });

  function handleCredentialSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const identifier = (form.elements.namedItem("identifier") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const creds = { identifier, password };
    setCredentials(creds);
    loginStep1(creds);
  }

  if (step === "mfa") {
    return (
      <div className="space-y-6 text-center">
        <div>
          <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
          <p className="text-xs text-gray-400 mt-1">Enter the 6-digit code from your authenticator app.</p>
        </div>
        <div className="flex justify-center">
          <OTPInput length={6} value={mfaCode} onChange={setMfaCode} autoFocus disabled={p2} />
        </div>
        <Button variant="primary" size="lg" className="w-full" loading={p2} disabled={mfaCode.length < 6}
          onClick={() => verifyMfa({ code: mfaCode })}>
          Verify & Enter Console
        </Button>
        <button type="button" onClick={() => { setStep("credentials"); setMfaCode(""); }}
          className="text-xs text-gray-500 hover:text-gray-300">
          ← Back to login
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleCredentialSubmit} noValidate className="space-y-4">
      <CredentialInputs disabled={p1} />
      <Button type="submit" variant="primary" size="lg" loading={p1} className="w-full">
        Continue to MFA →
      </Button>
    </form>
  );
}
