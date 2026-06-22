"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, Plus, Loader2, CheckCircle2, Trash2, Shield, User } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Member = {
  id: string; org_id: string; email: string;
  role: string; created_at: string;
};

type Org = { id: string; name: string };

const ROLES = ["requester", "approver", "viewer"];

export default function BusinessTeamPage() {
  const router = useRouter();
  const [org, setOrg]         = React.useState<Org | null>(null);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [tableMissing, setTableMissing] = React.useState(false);

  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole]   = React.useState("requester");
  const [inviting, setInviting]       = React.useState(false);
  const [inviteError, setInviteError] = React.useState<string | null>(null);
  const [invited, setInvited]         = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }

      const { data: orgData, error: orgErr } = await supabase
        .from("organisations").select("id, name")
        .eq("owner_id", session.user.id).maybeSingle();

      if (orgErr?.code === "42P01") { setTableMissing(true); setLoading(false); return; }
      if (!orgData) { router.replace("/business-portal"); return; }

      setOrg(orgData);
      const { data: memberData, error: memberErr } = await supabase
        .from("org_members").select("*")
        .eq("org_id", orgData.id).order("created_at", { ascending: false });

      if (memberErr?.code !== "42P01") setMembers(memberData ?? []);
      setLoading(false);
    });
  }, [router]);

  async function inviteMember(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !inviteEmail.trim()) return;
    setInviting(true);
    setInviteError(null);

    const { error } = await supabase.from("org_members").insert({
      org_id: org.id, email: inviteEmail.trim().toLowerCase(), role: inviteRole,
    });

    if (error) {
      if (error.code === "42P01") {
        setInviteError("The org_members table doesn't exist yet. See the SQL setup below.");
      } else if (error.code === "23505") {
        setInviteError("This email is already a member of your organisation.");
      } else {
        setInviteError(error.message);
      }
      setInviting(false);
      return;
    }

    const newMember: Member = {
      id: crypto.randomUUID(), org_id: org.id,
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole, created_at: new Date().toISOString(),
    };
    setMembers(p => [newMember, ...p]);
    setInviteEmail("");
    setInvited(true);
    setTimeout(() => setInvited(false), 3000);
    setInviting(false);
  }

  async function removeMember(id: string) {
    await supabase.from("org_members").delete().eq("id", id);
    setMembers(p => p.filter(m => m.id !== id));
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
    </div>
  );

  if (tableMissing) return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">Team</h1>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold text-amber-800 mb-1">Team table setup required</p>
        <pre className="rounded-xl bg-white border border-zo-border p-4 text-xs text-brand-charcoal overflow-x-auto whitespace-pre-wrap mt-3">{`create table if not exists public.org_members (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid references public.organisations(id) on delete cascade not null,
  email      text not null,
  role       text not null default 'requester',
  created_at timestamptz default now(),
  unique(org_id, email)
);
alter table public.org_members enable row level security;
create policy "Org owners manage members" on public.org_members
  for all using (
    exists (select 1 from public.organisations where id = org_id and owner_id = auth.uid())
  );`}</pre>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => window.location.reload()}>
          Refresh after running SQL
        </Button>
      </div>
    </div>
  );

  const ROLE_ICON: Record<string, React.ElementType> = {
    approver: Shield, requester: User, viewer: User,
  };
  const ROLE_COLOR: Record<string, string> = {
    approver:  "text-purple-700 bg-purple-50 border-purple-200",
    requester: "text-blue-700 bg-blue-50 border-blue-200",
    viewer:    "text-gray-600 bg-gray-50 border-gray-200",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-brand-charcoal">Team</h1>
        <p className="text-sm text-zo-muted mt-0.5">
          {org?.name} · {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Invite form */}
      <div className="rounded-2xl bg-white border border-zo-border p-5">
        <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-4">Invite Team Member</p>
        <form onSubmit={inviteMember} className="space-y-3">
          {inviteError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">{inviteError}</div>
          )}
          {invited && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-xs text-green-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Member invited successfully.
            </div>
          )}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted pointer-events-none" />
              <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com" required
                className="h-11 w-full rounded-xl border border-zo-border pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" />
            </div>
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
              className="h-11 rounded-xl border border-zo-border bg-white px-3 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition appearance-none">
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full" disabled={inviting || !inviteEmail.trim()}>
            {inviting
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Inviting…</>
              : <><Plus className="h-4 w-4 mr-2" />Add Member</>
            }
          </Button>
        </form>

        <div className="mt-4 rounded-xl bg-zo-bg-light border border-zo-border p-3 space-y-1">
          <p className="text-xs font-semibold text-brand-charcoal">Role permissions</p>
          {[
            { role: "Requester", desc: "Can create and track tasks" },
            { role: "Approver",  desc: "Can approve and cancel tasks" },
            { role: "Viewer",    desc: "Can view tasks and reports only" },
          ].map(({ role, desc }) => (
            <p key={role} className="text-xs text-zo-muted">
              <span className="font-medium text-brand-charcoal">{role}:</span> {desc}
            </p>
          ))}
        </div>
      </div>

      {/* Members list */}
      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zo-border bg-white p-10 text-center">
          <Users className="h-10 w-10 text-brand-gold/50 mx-auto mb-3" />
          <p className="text-sm font-semibold text-brand-charcoal">No team members yet</p>
          <p className="text-xs text-zo-muted mt-1">Invite colleagues to manage errands together.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="font-display text-sm font-bold text-brand-charcoal">Members ({members.length})</h2>
          {members.map(member => {
            const RoleIcon = ROLE_ICON[member.role] ?? User;
            return (
              <div key={member.id}
                className="flex items-center gap-3 rounded-xl border border-zo-border bg-white px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold font-bold text-sm">
                  {member.email[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-charcoal truncate">{member.email}</p>
                  <p className="text-xs text-zo-muted">
                    {new Date(member.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0",
                  ROLE_COLOR[member.role] ?? "text-gray-600 bg-gray-50 border-gray-200"
                )}>
                  <RoleIcon className="h-3 w-3" />
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
                <button type="button" onClick={() => removeMember(member.id)}
                  className="text-zo-muted hover:text-zo-error transition-colors shrink-0 ml-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
