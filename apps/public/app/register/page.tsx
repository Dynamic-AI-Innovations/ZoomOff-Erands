import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Sign Up | ZoomOff" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zo-bg-light flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
