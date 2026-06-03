"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, useToast } from "@zoomoff/ui";
import { loginSchema, type LoginInput } from "@zoomoff/validators";
import { authApi } from "@zoomoff/api-client";
import { setAuthTokens } from "@zoomoff/auth";

export function BusinessLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const { mutate, isPending } = useMutation({
    mutationFn: (d: LoginInput) => authApi.login(d),
    onSuccess: ({ user, tokens }) => {
      if (!["business_user","business_admin"].includes(user.role)) {
        toast({ type: "error", title: "Wrong portal", description: "Use the customer portal instead." });
        return;
      }
      setAuthTokens(tokens.accessToken, user);
      router.replace(params.get("next") ?? "/dashboard");
    },
    onError: () => toast({ type: "error", title: "Invalid credentials" }),
  });
  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} noValidate className="space-y-4">
      <Input label="Work Email or Phone" type="text" autoComplete="username" placeholder="admin@company.com" error={errors.identifier?.message} {...register("identifier")} />
      <Input label="Password" type="password" autoComplete="current-password" placeholder="Your password" error={errors.password?.message} {...register("password")} />
      <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">Log In</Button>
    </form>
  );
}
