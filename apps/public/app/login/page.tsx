import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log In | ZoomOff" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zo-bg-light flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
