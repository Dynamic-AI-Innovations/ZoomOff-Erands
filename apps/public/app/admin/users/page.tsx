"use client";

import * as React from "react";
import { Users, Search, ShieldCheck, User, Package } from "lucide-react";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  city: string | null;
  role: string | null;
  created_at: string;
};

type FilterRole = "all" | "customer" | "runner" | "admin";

const ROLE_STYLE: Record<string, string> = {
  admin:    "text-brand-gold bg-brand-gold/10 border-brand-gold/20",
  runner:   "text-blue-400  bg-blue-400/10   border-blue-400/20",
  customer: "text-zinc-400  bg-zinc-400/10   border-zinc-400/20",
};

export default function AdminUsersPage() {
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [tablesMissing, setTablesMissing] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<FilterRole>("all");

  React.useEffect(() => {
    supabase
      .from("profiles")
      .select("id, email, name, phone, city, role, created_at")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error?.code === "42P01") {
          setTablesMissing(true);
        } else {
          setProfiles(data ?? []);
        }
        setLoading(false);
      });
  }, []);

  const displayed = profiles.filter(p => {
    if (filter !== "all" && (p.role ?? "customer") !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (p.email ?? "").toLowerCase().includes(q) ||
        (p.name ?? "").toLowerCase().includes(q) ||
        (p.phone ?? "").includes(q)
      );
    }
    return true;
  });

  const counts = {
    all:      profiles.length,
    customer: profiles.filter(p => !p.role || p.role === "customer").length,
    runner:   profiles.filter(p => p.role === "runner").length,
    admin:    profiles.filter(p => p.role === "admin").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (tablesMissing) {
    return (
      <div className="space-y-5">
        <h1 className="font-display text-2xl font-extrabold text-white">Users</h1>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
          <p className="text-sm font-semibold text-amber-300 mb-1">Profiles table not found</p>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            The <code className="text-amber-300">profiles</code> table needs to be created to view users.
            Run the SQL below in Supabase SQL Editor, then refresh this page.
          </p>
          <pre className="rounded-xl bg-zinc-900 border border-zinc-700 p-4 text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">{`create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  name       text,
  phone      text,
  city       text,
  role       text default 'customer',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles
  for select using (
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone, role)
  values (
    new.id, new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();`}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Users</h1>
        <p className="text-sm text-zinc-400 mt-0.5">{profiles.length} registered users</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, email, or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {(["all", "customer", "runner", "admin"] as FilterRole[]).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setFilter(r)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === r
                ? "bg-brand-gold text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            )}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)} ({counts[r]})
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <Users className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">No users match this filter</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Phone</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">City</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {displayed.map(profile => (
                <tr key={profile.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 text-xs font-bold">
                        {(profile.name ?? profile.email ?? "?")[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{profile.name ?? "—"}</p>
                        <p className="text-xs text-zinc-500">{profile.email ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">
                    {profile.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">
                    {profile.city ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      ROLE_STYLE[profile.role ?? "customer"] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                    )}>
                      {profile.role === "admin"
                        ? <><ShieldCheck className="h-3 w-3" />Admin</>
                        : profile.role === "runner"
                          ? <><Package className="h-3 w-3" />Runner</>
                          : <><User className="h-3 w-3" />Customer</>
                      }
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs hidden lg:table-cell">
                    {new Date(profile.created_at).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
