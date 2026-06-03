"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, useToast } from "@zoomoff/ui";
import { loginSchema, type LoginInput } from "@zoomoff/validators";
import { authApi } from "@zoomoff/api-client";
import { setAuthTokens } from "@zoomoff/auth";

export function RunnerLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: ({ user, tokens }) => {
      if (user.role !== "runner") {
        toast({ type: "error", title: "Wrong portal", description: "This portal is for runners only." });
        return;
      }
      setAuthTokens(tokens.accessToken, user);
      router.replace(params.get("next") ?? "/dashboard");
    },
    onError: () => toast({ type: "error", title: "Invalid credentials", description: "Check your email/phone and password." }),
  });

  return (
    <form onSubmit={handleSubmit((d) => login(d))} noValidate className="space-y-4">
      <Input label="Email or Phone" type="text" autoComplete="username" placeholder="08012345678" error={errors.identifier?.message} {...register("identifier")} />
      <Input label="Password" type="password" autoComplete="current-password" placeholder="Your password" error={errors.password?.message} {...register("password")} />
      <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">Log In</Button>
    </form>
  );
}
