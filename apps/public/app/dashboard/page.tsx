"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, PlusCircle, Clock, CheckCircle2, User } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [runnerStatus, setRunnerStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }
      setUser(session.user);

      // Check if they have a runner application
      const { data } = await supabase
        .from("runner_applications")
        .select("status")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data) setRunnerStatus(data.status);
      setLoading(false);
    });

    // Keep session in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zo-bg-light flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const name = (user?.user_metadata?.name as string) ?? user?.email ?? "there";
  const firstName = name.split(" ")[0];
  const isRunner = !!runnerStatus;

  return (
    <div className="min-h-screen bg-zo-bg-light">
      {/* Top bar */}
      <header className="bg-white border-b border-zo-border px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">
            Welcome, {firstName}!
          </h1>
          <p className="text-sm text-zo-muted mt-1">{user?.email}</p>
        </div>

        {/* Runner application status */}
        {isRunner && (
          <div className={`rounded-2xl border p-5 flex items-start gap-4 ${
            runnerStatus === "approved"
              ? "border-zo-success bg-zo-success-light"
              : runnerStatus === "rejected"
                ? "border-zo-error bg-zo-error-light"
                : "border-brand-gold/40 bg-brand-gold/5"
          }`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shrink-0">
              {runnerStatus === "approved"
                ? <CheckCircle2 className="h-5 w-5 text-zo-success" />
                : <Clock className="h-5 w-5 text-brand-gold" />
              }
            </div>
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">
                Runner Application —{" "}
                <span className="capitalize">{runnerStatus}</span>
              </p>
              <p className="text-xs text-zo-muted mt-0.5">
                {runnerStatus === "pending" && "We're reviewing your application. Usually within 2 hours."}
                {runnerStatus === "in_review" && "Your application is actively being reviewed by our team."}
                {runnerStatus === "approved" && "Congratulations! Your account is approved. Start accepting tasks."}
                {runnerStatus === "rejected" && "Your application was not approved. Contact support for details."}
              </p>
            </div>
          </div>
        )}

        {/* Main CTA */}
        {!isRunner && (
          <div className="rounded-2xl bg-brand-charcoal p-6 text-white">
            <h2 className="font-display text-lg font-bold mb-1">Need something done?</h2>
            <p className="text-sm text-gray-400 mb-4">Request an errand and get matched with a verified runner in minutes.</p>
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/delegate">
                <PlusCircle className="h-4 w-4 mr-2" /> Request an Errand
              </Link>
            </Button>
          </div>
        )}

        {/* Account card */}
        <div className="rounded-2xl bg-white border border-zo-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">{name}</p>
              <p className="text-xs text-zo-muted">{isRunner ? "Runner account" : "Customer account"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/delegate" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
              <span>Request an errand</span>
              <span className="text-zo-muted">→</span>
            </Link>
            {!isRunner && (
              <Link href="/runner-apply" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
                <span>Become a runner</span>
                <span className="text-zo-muted">→</span>
              </Link>
            )}
            <Link href="/how-it-works" className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
              <span>How it works</span>
              <span className="text-zo-muted">→</span>
            </Link>
          </div>
        </div>

        <p className="text-center text-2xs text-zo-muted/60 tracking-wide">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
