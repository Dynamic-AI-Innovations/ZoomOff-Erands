import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(10, "Enter a valid phone number")
  .max(15, "Enter a valid phone number")
  .regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol");

export const otpSchema = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(/^[0-9]{6}$/, "OTP must be numeric");

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone is required")
    .refine(
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9]{10,15}$/.test(v),
      { message: "Enter a valid email or phone number" }
    ),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    phone: phoneSchema,
    email: z.string().email("Enter a valid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone is required")
    .refine(
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9]{10,15}$/.test(v),
      { message: "Enter a valid email or phone number" }
    ),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const totpSchema = z.object({
  code: z
    .string()
    .length(6, "MFA code must be 6 digits")
    .regex(/^[0-9]{6}$/, "MFA code must be numeric"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type TotpInput = z.infer<typeof totpSchema>;
