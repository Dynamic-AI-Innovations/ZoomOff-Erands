import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Log In | ZoomOff" };

export default function LoginPage() {
  // Customer login lives in the customer portal app.
  // The NEXT_PUBLIC_CUSTOMER_URL env var points there (e.g. app.zoomoff.africa).
  // If not set (local dev), fall back to the customer dev port.
  const customerUrl = process.env.NEXT_PUBLIC_CUSTOMER_URL ?? "http://localhost:3001";
  redirect(`${customerUrl}/login`);
}
