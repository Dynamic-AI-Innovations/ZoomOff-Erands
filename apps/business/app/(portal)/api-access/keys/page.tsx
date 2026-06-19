"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Button, Card, Badge, Modal, Input, useToast } from "@zoomoff/ui";
import { Key, Plus, RotateCcw, Trash2, Copy, Eye, EyeOff } from "lucide-react";

interface ApiKey {
  id: string;
  label: string;
  prefix: string; // e.g. "zo_live_abc..."
  scope: string[];
  createdAt: string;
  lastUsedAt: string | null;
}

export default function ApiKeysPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = React.useState(false);
  const [newKeyLabel, setNewKeyLabel] = React.useState("");
  const [newKeyValue, setNewKeyValue] = React.useState<string | null>(null);
  const [revealedKey, setRevealedKey] = React.useState<string | null>(null);

  const { data: keys, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => apiClient.get<{ data: ApiKey[] }>("/business/api-keys").then(r => r.data.data),
  });

  const { mutate: createKey, isPending: creating } = useMutation({
    mutationFn: () => apiClient.post<{ data: { key: ApiKey; secret: string } }>("/business/api-keys", { label: newKeyLabel }),
    onSuccess: (res) => {
      setNewKeyValue(res.data.data.secret);
      setNewKeyLabel("");
      qc.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: () => toast({ type: "error", title: "Could not create key" }),
  });

  const { mutate: revokeKey } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/business/api-keys/${id}`),
    onSuccess: () => {
      toast({ type: "success", title: "API key revoked" });
      qc.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">API Access</h1>
          <p className="text-sm text-zo-muted mt-1">Manage API keys for programmatic task creation</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" /> New API Key
        </Button>
      </div>

      {isLoading && <p className="text-sm text-zo-muted">Loading keys...</p>}

      {!isLoading && (keys ?? []).length === 0 && (
        <Card className="text-center py-12">
          <Key className="h-10 w-10 text-zo-border mx-auto mb-3" aria-hidden="true" />
          <p className="font-semibold text-brand-charcoal">No API keys yet</p>
          <p className="text-xs text-zo-muted mt-1">Create a key to integrate ZoomOff Errands task creation into your systems</p>
        </Card>
      )}

      <div className="space-y-3">
        {(keys ?? []).map(key => (
          <Card key={key.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10">
                <Key className="h-4 w-4 text-brand-gold" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-brand-charcoal">{key.label}</p>
                <code className="text-xs text-zo-muted font-mono">{key.prefix}...</code>
                <p className="text-xs text-zo-muted">
                  Created {formatDate(key.createdAt)}
                  {key.lastUsedAt ? ` · Last used ${formatDate(key.lastUsedAt)}` : " · Never used"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => revokeKey(key.id)} className="p-1.5 rounded-lg text-zo-muted hover:text-zo-error hover:bg-zo-error-light" aria-label="Revoke key">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create key modal */}
      <Modal open={showCreate} onOpenChange={setShowCreate} title="Create API Key" size="sm">
        {newKeyValue ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-zo-success-light border border-zo-success/30 p-4">
              <p className="text-xs font-semibold text-zo-success mb-2">✓ API Key Created — copy it now!</p>
              <p className="text-xs text-zo-muted mb-3">This key will only be shown once. Store it securely.</p>
              <div className="flex items-center gap-2 bg-white rounded-lg border border-zo-border p-2">
                <code className="text-xs font-mono flex-1 truncate">{revealedKey === newKeyValue ? newKeyValue : "zo_live_" + "•".repeat(40)}</code>
                <button onClick={() => setRevealedKey(revealedKey ? null : newKeyValue)} className="text-zo-muted hover:text-brand-charcoal">
                  {revealedKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(newKeyValue); toast({ type: "success", title: "Copied!" }); }} className="text-zo-muted hover:text-brand-charcoal">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={() => { setShowCreate(false); setNewKeyValue(null); setRevealedKey(null); }}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input label="Key Label" value={newKeyLabel} onChange={e => setNewKeyLabel(e.target.value)} placeholder="e.g. Production Integration, Staging" />
            <Button variant="primary" size="lg" className="w-full" disabled={!newKeyLabel.trim()} loading={creating} onClick={() => createKey()}>
              Generate Key
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
