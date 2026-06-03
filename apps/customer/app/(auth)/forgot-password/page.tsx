"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button, Input, useToast } from "@zoomoff/ui";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@zoomoff/validators";
import { authApi } from "@zoomoff/api-client";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [sent, setSent] = React.useState(false);
  const [identifier, setIdentifier] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ForgotPasswordInput) => authApi.forgotPassword(data),
    onSuccess: (_, variables) => {
      setIdentifier(variables.identifier);
      setSent(true);
    },
    onError: () => {
      toast({
        type: "error",
        title: "Something went wrong",
        description: "If an account exists, a reset link has been sent.",
      });
      setSent(true); // Don't reveal whether email/phone exists
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-light">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to login
          </Link>
        </div>

        <div className="rounded-2xl border border-zo-border bg-white p-8 shadow-card">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-zo-success mx-auto mb-4" aria-hidden="true" />
              <h1 className="font-display text-xl font-bold text-brand-charcoal">Check your inbox</h1>
              <p className="mt-2 text-sm text-zo-muted">
                If an account exists for{" "}
                <span className="font-semibold text-brand-charcoal">{identifier}</span>
                , we&apos;ve sent a reset link. It expires in 15 minutes.
              </p>
              <Button variant="outline" size="lg" className="mt-6 w-full" asChild>
                <Link href="/login">Back to login</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-brand-charcoal mb-2">
                Reset your password
              </h1>
              <p className="text-sm text-zo-muted mb-6">
                Enter your email or phone number and we&apos;ll send a reset link.
              </p>
              <form onSubmit={handleSubmit((d) => mutate(d))} noValidate className="space-y-4">
                <Input
                  label="Email or Phone"
                  type="text"
                  placeholder="you@example.com or 08012345678"
                  autoComplete="username"
                  error={errors.identifier?.message}
                  {...register("identifier")}
                />
                <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
