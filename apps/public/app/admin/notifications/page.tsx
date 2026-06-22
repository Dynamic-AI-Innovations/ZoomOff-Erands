"use client";

import * as React from "react";
import { Bell, Send, Loader2, CheckCircle2, Users, Package, UserCheck } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { supabase } from "@zoomoff/api-client";

const AUDIENCES = [
  { key: "all",       label: "All Users",       icon: Users },
  { key: "customers", label: "Customers Only",  icon: Package },
  { key: "runners",   label: "Runners Only",    icon: UserCheck },
];

const TYPES = ["info", "success", "warning", "alert"];

const TEMPLATES = [
  { label: "New feature", body: "We've just launched a new feature to make your experience even better. Check it out!" },
  { label: "Maintenance", body: "We'll be performing scheduled maintenance on Saturday 12am–2am. Services may be briefly unavailable." },
  { label: "Promo",       body: "Use code ZOOM20 for 20% off your next errand! Valid until end of month." },
  { label: "Welcome",     body: "Welcome to ZoomOff Errands! Start requesting errands and get things done faster." },
];

export default function AdminNotificationsPage() {
  const [audience, setAudience] = React.useState("all");
  const [type, setType]         = React.useState("info");
  const [title, setTitle]       = React.useState("");
  const [body, setBody]         = React.useState("");
  const [actionUrl, setActionUrl] = React.useState("");
  const [sending, setSending]   = React.useState(false);
  const [sent, setSent]         = React.useState(false);
  const [error, setError]       = React.useState<string | null>(null);
  const [sentCount, setSentCount] = React.useState(0);

  async function sendNotification(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setError(null);

    // Fetch target user IDs based on audience
    let userIds: string[] = [];

    if (audience === "all" || audience === "customers") {
      const { data } = await supabase
        .from("profiles").select("id").neq("role", "admin");
      if (data) {
        if (audience === "customers") {
          userIds = data.filter((p: { id: string; role?: string }) => p.role !== "runner").map((p: { id: string }) => p.id);
        } else {
          userIds = data.map((p: { id: string }) => p.id);
        }
      }
    }

    if (audience === "runners") {
      const { data } = await supabase
        .from("runner_applications").select("user_id").eq("status", "approved");
      if (data) userIds = data.map((r: { user_id: string }) => r.user_id);
    }

    if (userIds.length === 0) {
      // Fallback: insert for all (profiles table may not exist)
      setError("No target users found. Ensure the profiles table exists with user records.");
      setSending(false);
      return;
    }

    const rows = userIds.map(uid => ({
      user_id: uid, type,
      title: title.trim(), body: body.trim(),
      action_url: actionUrl.trim() || null,
    }));

    // Insert in batches of 100
    const batchSize = 100;
    let insertError: string | null = null;
    for (let i = 0; i < rows.length; i += batchSize) {
      const { error: err } = await supabase.from("notifications").insert(rows.slice(i, i + batchSize));
      if (err) { insertError = err.message; break; }
    }

    if (insertError) {
      setError(insertError);
    } else {
      setSentCount(rows.length);
      setSent(true);
      setTitle("");
      setBody("");
      setActionUrl("");
      setTimeout(() => setSent(false), 5000);
    }
    setSending(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Broadcast Notification</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Send a push notification to users on the platform</p>
      </div>

      {/* Templates */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Quick Templates</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEMPLATES.map(t => (
            <button key={t.label} type="button"
              onClick={() => { setTitle(t.label); setBody(t.body); }}
              className="rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-xs text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors text-left">
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={sendNotification} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">{error}</div>
        )}
        {sent && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-xs text-green-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Notification sent to {sentCount} user{sentCount !== 1 ? "s" : ""}!
          </div>
        )}

        {/* Audience */}
        <div>
          <p className="text-xs font-semibold text-zinc-400 mb-2">Audience</p>
          <div className="flex gap-2 flex-wrap">
            {AUDIENCES.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" onClick={() => setAudience(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  audience === key
                    ? "bg-brand-gold text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
                )}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <p className="text-xs font-semibold text-zinc-400 mb-2">Notification Type</p>
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                  type === t
                    ? "bg-brand-gold text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
                )}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Notification title…" required maxLength={80}
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" />
          <p className="text-xs text-zinc-600 mt-0.5">{title.length}/80</p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Message *</label>
          <textarea value={body} onChange={e => setBody(e.target.value)}
            placeholder="Write your notification message…" required rows={4} maxLength={300}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition resize-none" />
          <p className="text-xs text-zinc-600 mt-0.5">{body.length}/300</p>
        </div>

        {/* Action URL */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Action URL (optional)</label>
          <input type="text" value={actionUrl} onChange={e => setActionUrl(e.target.value)}
            placeholder="/dashboard, /delegate, /wallet…"
            className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" />
        </div>

        {/* Preview */}
        {(title || body) && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
            <p className="text-xs text-zinc-500 mb-2">Preview</p>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/20 shrink-0">
                <Bell className="h-4 w-4 text-brand-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title || "Title…"}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{body || "Message…"}</p>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={sending || !title.trim() || !body.trim()}>
          {sending
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending…</>
            : <><Send className="h-4 w-4 mr-2" />Send Notification</>
          }
        </Button>
      </form>
    </div>
  );
}
