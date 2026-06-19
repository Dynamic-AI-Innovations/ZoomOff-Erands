import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset Password | ZoomOff Errands" };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-zo-bg-light flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}
