import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Sign Up | ZoomOff" };

export default function RegisterPage() {
  const customerUrl = process.env.NEXT_PUBLIC_CUSTOMER_URL ?? "http://localhost:3001";
  redirect(`${customerUrl}/register`);
}
