"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, useToast } from "@zoomoff/ui";
import { registerSchema, type RegisterInput } from "@zoomoff/validators";
import { authApi } from "@zoomoff/api-client";

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const { mutate: doRegister, isPending } = useMutation({
    mutationFn: (data: RegisterInput) =>
      authApi.register({ phone: data.phone, email: data.email, name: data.name, password: data.password }),
    onSuccess: (_, variables) => {
      router.push(`/verify-phone?phone=${encodeURIComponent(variables.phone)}`);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast({ type: "error", title: "Registration failed", description: message });
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => doRegister(d))} noValidate className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        autoComplete="name"
        placeholder="Adaeze Okonkwo"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Phone Number"
        type="tel"
        autoComplete="tel"
        placeholder="08012345678"
        error={errors.phone?.message}
        helperText="We'll send a verification code to this number"
        {...register("phone")}
      />
      <Input
        label="Email Address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 symbol"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {/* Password strength indicator */}
      <PasswordStrength password={watch("password") ?? ""} />

      <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
        Create Account
      </Button>
    </form>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Symbol", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const passed = checks.filter((c) => c.pass).length;

  if (!password) return null;

  const strengthColor =
    passed <= 1 ? "bg-zo-error" : passed <= 2 ? "bg-zo-warning" : passed <= 3 ? "bg-brand-gold" : "bg-zo-success";

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= passed ? strengthColor : "bg-zo-border"}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map(({ label, pass }) => (
          <p key={label} className={`text-xs flex items-center gap-1 ${pass ? "text-zo-success" : "text-zo-muted"}`}>
            <span>{pass ? "✓" : "○"}</span> {label}
          </p>
        ))}
      </div>
    </div>
  );
}
