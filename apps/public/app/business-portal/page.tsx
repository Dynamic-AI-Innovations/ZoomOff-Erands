"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2, Package, Users, TrendingUp, PlusCircle,
  ChevronRight, CheckCircle2, Clock, Loader2, Save,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Org = {
  id: string; name: string; industry: string | null;
  size: string | null; city: string | null; created_at: string;
};

type TaskSummary = {
  status: string;
};

const INDUSTRIES = [
  "Technology", "Finance / Banking", "Healthcare", "Retail / E-commerce",
  "Logistics", "Education", "Legal", "Real Estate", "Media", "Other",
];
const SIZES  = ["1–10", "11–50", "51–200", "201–500", "500+"];
const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Other"];

const STATUS_LABEL: Record<string, string> = {
  posted: "Finding Runner", assigned: "Assigned", en_route: "En Route",
  in_progress: "In Progress", completed: "Completed",
  cancelled: "Cancelled", disputed: "Disputed",
};
const STATUS_COLOR: Record<string, string> = {
  posted:      "text-amber-700 bg-amber-50 border-amber-200",
  assigned:    "text-blue-700 bg-blue-50 border-blue-200",
  en_route:    "text-blue-700 bg-blue-50 border-blue-200",
  in_progress: "text-orange-700 bg-orange-50 border-orange-200",
  completed:   "text-green-700 bg-green-50 border-green-200",
  cancelled:   "text-gray-500 bg-gray-50 border-gray-200",
  disputed:    "text-red-700 bg-red-50 border-red-200",
};

export default function BusinessPortalPage() {
  const router = useRouter();
  const [user, setUser]   = React.useState<SupabaseUser | null>(null);
  const [org, setOrg]     = React.useState<Org | null>(null);
  const [tasks, setTasks] = React.useState<TaskSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [tableMissing, setTableMissing] = React.useState(false);

  // Setup form state
  const [setupMode, setSetupMode] = React.useState(false);
  const [orgName, setOrgName]     = React.useState("");
  const [industry, setIndustry]   = React.useState("");
  const [size, setSize]           = React.useState("");
  const [city, setCity]           = React.useState("");
  const [saving, setSaving]       = React.useState(false);
  const [saveErr, setSaveErr]     = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUser(session.user);

      const { data: orgData, error: orgErr } = await supabase
        .from("organisations").select("*")
        .eq("owner_id", session.user.id).maybeSingle();

      if (orgErr?.code === "42P01") { setTableMissing(true); setLoading(false); return; }

      if (orgData) {
        setOrg(orgData);
        const { data: taskData } = await supabase
          .from("tasks").select("status")
          .eq("user_id", session.user.id);
        setTasks(taskData ?? []);
      } else {
        setSetupMode(true);
      }
      setLoading(false);
    });
  }, [router]);

  async function createOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !orgName.trim()) return;
    setSaving(true);
    setSaveErr(null);
    const { data, error } = await supabase.from("organisations").insert({
      owner_id: user.id, name: orgName.trim(),
      industry: industry || null, size: size || null, city: city || null,
    }).select().single();
    if (error) { setSaveErr(error.message); setSaving(false); return; }
    setOrg(data);
    setSetupMode(false);
    setSaving(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
    </div>
  );

  if (tableMissing) return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">Business Portal</h1>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold text-amber-800 mb-1">One-time setup required</p>
        <p className="text-xs text-zo-muted leading-relaxed mb-4">
          Run this SQL in your Supabase SQL Editor to enable the Business Portal, then refresh.
        </p>
        <pre className="rounded-xl bg-white border border-zo-border p-4 text-xs text-brand-charcoal overflow-x-auto whitespace-pre-wrap">{`create table if not exists public.organisations (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid references auth.users(id) not null,
  name       text not null,
  industry   text,
  size       text,
  city       text,
  created_at timestamptz default now()
);
alter table public.organisations enable row level security;
create policy "Org owners manage org" on public.organisations
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);`}</pre>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => window.location.reload()}>
          Refresh after running SQL
        </Button>
      </div>
    </div>
  );

  // Setup flow
  if (setupMode) return (
    <div className="max-w-lg space-y-6">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/15 mb-4">
          <Building2 className="h-7 w-7 text-brand-gold" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">Set Up Your Organisation</h1>
        <p className="text-sm text-zo-muted mt-1">
          Create your business account to manage team errands, track spend, and get priority service.
        </p>
      </div>

      <form onSubmit={createOrg} className="rounded-2xl bg-white border border-zo-border p-6 space-y-4">
        {saveErr && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">{saveErr}</div>
        )}

        <div>
          <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">Organisation Name *</label>
          <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
            placeholder="Acme Nigeria Ltd."
            className="h-11 w-full rounded-xl border border-zo-border px-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">Industry</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)}
              className="h-11 w-full rounded-xl border border-zo-border bg-white px-3 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition appearance-none">
              <option value="">Select…</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">Company Size</label>
            <select value={size} onChange={e => setSize(e.target.value)}
              className="h-11 w-full rounded-xl border border-zo-border bg-white px-3 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition appearance-none">
              <option value="">Select…</option>
              {SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">Primary City</label>
          <select value={city} onChange={e => setCity(e.target.value)}
            className="h-11 w-full rounded-xl border border-zo-border bg-white px-3 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition appearance-none">
            <option value="">Select city…</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={saving || !orgName.trim()}>
          {saving
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating…</>
            : <><Save className="h-4 w-4 mr-2" />Create Organisation</>
          }
        </Button>
      </form>
    </div>
  );

  // Dashboard
  const ACTIVE = ["posted", "assigned", "en_route", "in_progress"];
  const activeTasks    = tasks.filter(t => ACTIVE.includes(t.status)).length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const name = (user?.user_metadata?.name as string) ?? user?.email ?? "there";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">
            {org?.name ?? "Business Dashboard"}
          </h1>
          <p className="text-sm text-zo-muted mt-0.5">
            Welcome back, {name.split(" ")[0]}
            {org?.city ? ` · ${org.city}` : ""}
            {org?.industry ? ` · ${org.industry}` : ""}
          </p>
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link href="/delegate">
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> New Errand
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Tasks",  value: tasks.length,    color: "text-brand-charcoal", icon: Package },
          { label: "Active",       value: activeTasks,     color: "text-amber-600",       icon: Clock },
          { label: "Completed",    value: completedTasks,  color: "text-green-600",       icon: CheckCircle2 },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-white border border-zo-border p-4 text-center">
            <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
            <p className={`font-display text-2xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-zo-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/business-portal/tasks"
          className="flex items-center gap-4 rounded-2xl bg-white border border-zo-border p-5 hover:border-brand-gold/40 hover:shadow-sm transition-all group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/10 shrink-0">
            <Package className="h-6 w-6 text-brand-gold" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-charcoal text-sm">Task Board</p>
            <p className="text-xs text-zo-muted">Manage all organisation errands</p>
          </div>
          <ChevronRight className="h-4 w-4 text-zo-muted group-hover:text-brand-charcoal transition-colors" />
        </Link>

        <Link href="/business-portal/team"
          className="flex items-center gap-4 rounded-2xl bg-white border border-zo-border p-5 hover:border-brand-gold/40 hover:shadow-sm transition-all group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 shrink-0">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-charcoal text-sm">Team Members</p>
            <p className="text-xs text-zo-muted">Invite and manage your team</p>
          </div>
          <ChevronRight className="h-4 w-4 text-zo-muted group-hover:text-brand-charcoal transition-colors" />
        </Link>

        <Link href="/delegate"
          className="flex items-center gap-4 rounded-2xl bg-brand-charcoal p-5 text-white hover:bg-brand-charcoal/90 transition-all group sm:col-span-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 shrink-0">
            <TrendingUp className="h-6 w-6 text-brand-gold" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Request a Business Errand</p>
            <p className="text-xs text-gray-400">Delegated tasks track automatically to your org dashboard</p>
          </div>
          <ChevronRight className="h-4 w-4 text-brand-gold" />
        </Link>
      </div>

      {/* Org details */}
      {org && (
        <div className="rounded-2xl bg-white border border-zo-border p-5">
          <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-3">Organisation Profile</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Company",  value: org.name },
              { label: "Industry", value: org.industry ?? "—" },
              { label: "Size",     value: org.size ? `${org.size} employees` : "—" },
              { label: "City",     value: org.city ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-zo-border px-3 py-2.5">
                <p className="text-xs text-zo-muted">{label}</p>
                <p className="text-sm font-semibold text-brand-charcoal mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
