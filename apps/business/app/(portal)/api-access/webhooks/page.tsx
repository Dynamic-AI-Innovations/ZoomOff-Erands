"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Button, Card, Badge, Input, useToast } from "@zoomoff/ui";
import { Webhook, Plus, Trash2, CheckCircle2 } from "lucide-react";

const EVENTS = ["task.created","task.assigned","task.completed","task.disputed","payment.processed"] as const;

interface WebhookConfig { id: string; url: string; events: string[]; active: boolean; createdAt: string; }

export default function WebhooksPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [url, setUrl] = React.useState("");
  const [selectedEvents, setSelectedEvents] = React.useState<string[]>([]);
  const [showForm, setShowForm] = React.useState(false);

  const { data: webhooks } = useQuery({
    queryKey: ["webhooks"],
    queryFn: () => apiClient.get<{ data: WebhookConfig[] }>("/business/webhooks").then(r => r.data.data),
  });

  const { mutate: create, isPending } = useMutation({
    mutationFn: () => apiClient.post("/business/webhooks", { url, events: selectedEvents }),
    onSuccess: () => {
      toast({ type: "success", title: "Webhook configured" });
      setUrl(""); setSelectedEvents([]); setShowForm(false);
      qc.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/business/webhooks/${id}`),
    onSuccess: () => { toast({ type: "success", title: "Webhook removed" }); qc.invalidateQueries({ queryKey: ["webhooks"] }); },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Webhooks</h1>
          <p className="text-sm text-zo-muted mt-1">Receive real-time events to your endpoint</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(v => !v)}>
          <Plus className="h-4 w-4" /> Add Webhook
        </Button>
      </div>

      {showForm && (
        <Card className="space-y-4">
          <Input label="Endpoint URL" type="url" placeholder="https://your-server.com/webhook" value={url} onChange={e => setUrl(e.target.value)} />
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-brand-charcoal">Events to receive</p>
            <div className="flex flex-wrap gap-2">
              {EVENTS.map(ev => (
                <button key={ev} onClick={() => setSelectedEvents(s => s.includes(ev) ? s.filter(x=>x!==ev) : [...s,ev])}
                  className={`rounded-full border px-3 py-1 text-xs font-mono font-medium transition-colors ${selectedEvents.includes(ev) ? "border-brand-gold bg-brand-gold/10 text-brand-charcoal" : "border-zo-border text-zo-muted"}`}>
                  {ev}
                </button>
              ))}
            </div>
          </div>
          <Button variant="primary" size="md" disabled={!url || selectedEvents.length === 0} loading={isPending} onClick={() => create()}>
            Save Webhook
          </Button>
        </Card>
      )}

      {(webhooks ?? []).length === 0 && !showForm && (
        <Card className="text-center py-10">
          <Webhook className="h-10 w-10 text-zo-border mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm font-semibold text-brand-charcoal">No webhooks configured</p>
        </Card>
      )}

      <div className="space-y-3">
        {(webhooks ?? []).map(wh => (
          <Card key={wh.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <code className="text-sm font-mono text-brand-charcoal truncate block">{wh.url}</code>
              <div className="flex flex-wrap gap-1 mt-2">
                {wh.events.map(ev => <Badge key={ev} variant="muted" className="font-mono text-2xs">{ev}</Badge>)}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={wh.active ? "success" : "muted"} dot>{wh.active ? "Active" : "Inactive"}</Badge>
              <button onClick={() => remove(wh.id)} className="p-1.5 rounded-lg text-zo-muted hover:text-zo-error" aria-label="Remove webhook">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
