"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, LogOut, Save, Loader2, CheckCircle2,
  User, Phone, Mail, MapPin, ShieldCheck,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

const CITIES = [
  "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano",
  "Enugu", "Benin City", "Kaduna", "Owerri", "Uyo",
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [createdAt, setCreatedAt] = React.useState("");

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setEmail(session.user.email ?? "");
      setName((session.user.user_metadata?.name as string) ?? "");
      setPhone((session.user.user_metadata?.phone as string) ?? "");
      setCity((session.user.user_metadata?.city as string) ?? "");
      setCreatedAt(session.user.created_at ?? "");
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({
      data: { name: name.trim(), phone: phone.trim(), city },
    });
    if (err) setError(err.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

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

  const initials = name
    ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : email[0]?.toUpperCase() ?? "?";

  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen bg-zo-bg-light">
      <header className="bg-white border-b border-zo-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-zo-error transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="font-display text-xl font-extrabold text-brand-charcoal">My Profile</h1>

        {/* Avatar + summary */}
        <div className="rounded-2xl bg-white border border-zo-border p-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold font-bold text-xl">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-brand-charcoal">{name || email}</p>
            <p className="text-xs text-zo-muted">{email}</p>
            {joinDate && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-zo-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                Member since {joinDate}
              </div>
            )}
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="rounded-2xl bg-white border border-zo-border p-5 space-y-4">
          <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">Personal Information</p>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">{error}</div>
          )}
          {saved && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-xs text-green-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Profile saved successfully.
            </div>
          )}

          {/* Full name */}
          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="h-11 w-full rounded-xl border border-zo-border pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Email read-only */}
          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted pointer-events-none" />
              <input
                type="email"
                value={email}
                disabled
                className="h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-zo-muted cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-zo-muted mt-1">Email address cannot be changed.</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="h-11 w-full rounded-xl border border-zo-border pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted pointer-events-none" />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="h-11 w-full rounded-xl border border-zo-border bg-white pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition appearance-none"
              >
                <option value="">Select your city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full" disabled={saving}>
            {saving
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
              : <><Save className="h-4 w-4 mr-2" />Save Changes</>
            }
          </Button>
        </form>

        {/* Account actions */}
        <div className="rounded-2xl bg-white border border-zo-border p-5 space-y-3">
          <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">Account</p>
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-sm text-zo-muted hover:border-red-200 hover:bg-red-50 hover:text-zo-error transition-colors"
          >
            Sign out of this account
          </button>
          <p className="text-xs text-zo-muted px-1">
            To delete your account, email{" "}
            <a href="mailto:support@zoomoff.africa" className="text-brand-gold hover:underline">support@zoomoff.africa</a>.
          </p>
        </div>

        <p className="text-center text-2xs text-zo-muted/60 pb-4">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}
