"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Badge, Button, Card, Modal, useToast } from "@zoomoff/ui";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface KycApplication {
  id: string;
  runnerId: string;
  runnerName: string;
  submittedAt: string;
  ninStatus: "matched" | "mismatched" | "pending";
  bvnStatus: "matched" | "mismatched" | "pending";
  faceMatchScore: number;
  bankVerified: boolean;
  hoursInQueue: number;
}

function formatHoursAgo(h: number) {
  if (h < 1) return "< 1 hour ago";
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function KycReviewQueue() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [reviewing, setReviewing] = React.useState<KycApplication | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");

  const { data: queue, isLoading } = useQuery({
    queryKey: ["kyc-queue"],
    queryFn: () => apiClient.get<{ data: KycApplication[] }>("/admin/kyc-queue").then(r => r.data.data),
    refetchInterval: 30000,
  });

  const { mutate: approve, isPending: approving } = useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/kyc/${id}/approve`),
    onSuccess: () => {
      toast({ type: "success", title: "KYC approved", description: "Runner account activated." });
      setReviewing(null);
      qc.invalidateQueries({ queryKey: ["kyc-queue"] });
    },
    onError: () => toast({ type: "error", title: "Approval failed" }),
  });

  const { mutate: reject, isPending: rejecting } = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.post(`/admin/kyc/${id}/reject`, { reason }),
    onSuccess: () => {
      toast({ type: "info", title: "KYC rejected", description: "Runner notified with reason." });
      setReviewing(null);
      setRejectionReason("");
      qc.invalidateQueries({ queryKey: ["kyc-queue"] });
    },
  });

  const apps = queue ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">KYC Review Queue</h1>
          <p className="text-sm text-gray-400 mt-1">SLA: 24 hours per application</p>
        </div>
        <Badge variant={apps.length > 0 ? "warning" : "success"} dot>
          {apps.length} pending
        </Badge>
      </div>

      {isLoading && <div className="text-center py-10 text-gray-400">Loading queue...</div>}

      {!isLoading && apps.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-zo-success mx-auto mb-3" aria-hidden="true" />
          <p className="text-white font-semibold">Queue empty — all clear!</p>
        </div>
      )}

      <div className="space-y-3">
        {apps.map(app => (
          <div key={app.id} className={`rounded-xl border p-4 cursor-pointer hover:bg-white/10 transition-colors ${app.hoursInQueue >= 20 ? "border-zo-error/50 bg-zo-error/10" : "border-white/10 bg-white/5"}`}
            onClick={() => setReviewing(app)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{app.runnerName}</p>
                <p className="text-xs text-gray-400 mt-0.5">Submitted {formatHoursAgo(app.hoursInQueue)}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Badge variant={app.ninStatus === "matched" ? "success" : app.ninStatus === "mismatched" ? "error" : "muted"}>
                  NIN {app.ninStatus}
                </Badge>
                <Badge variant={app.bvnStatus === "matched" ? "success" : app.bvnStatus === "mismatched" ? "error" : "muted"}>
                  BVN {app.bvnStatus}
                </Badge>
                <Badge variant={app.faceMatchScore >= 90 ? "success" : "warning"}>
                  Face {app.faceMatchScore}%
                </Badge>
                {app.hoursInQueue >= 20 && (
                  <Badge variant="error" dot>SLA at risk</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review modal */}
      <Modal open={!!reviewing} onOpenChange={() => setReviewing(null)} title="KYC Review" size="xl">
        {reviewing && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-zo-bg-light p-4 text-center">
                <p className="text-xs text-zo-muted mb-2 font-semibold">ID DOCUMENT</p>
                <div className="h-40 bg-zo-border rounded-xl flex items-center justify-center">
                  <p className="text-xs text-zo-muted">ID photo loads from S3</p>
                </div>
              </div>
              <div className="rounded-xl bg-zo-bg-light p-4 text-center">
                <p className="text-xs text-zo-muted mb-2 font-semibold">BIOMETRIC SELFIE</p>
                <div className="h-40 bg-zo-border rounded-xl flex items-center justify-center">
                  <p className="text-xs text-zo-muted">Selfie photo loads from S3</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "NIN", status: reviewing.ninStatus },
                { label: "BVN", status: reviewing.bvnStatus },
                { label: "Face Match", status: reviewing.faceMatchScore >= 90 ? "matched" : "low" },
                { label: "Bank Account", status: reviewing.bankVerified ? "matched" : "pending" },
              ].map(({ label, status }) => (
                <div key={label} className="rounded-xl border border-zo-border bg-white p-3 text-center">
                  <p className="text-xs text-zo-muted">{label}</p>
                  <Badge variant={status === "matched" ? "success" : status === "mismatched" ? "error" : "warning"} className="mt-1">
                    {status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="primary" size="lg" loading={approving} onClick={() => approve(reviewing.id)}>
                <CheckCircle2 className="h-4 w-4" /> Approve All & Activate Runner
              </Button>

              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-charcoal">Reject with reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Explain why the KYC was rejected (runner will see this)..."
                  className="w-full rounded-xl border border-zo-border px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                />
                <Button
                  variant="danger-outline"
                  size="md"
                  className="w-full"
                  disabled={!rejectionReason.trim()}
                  loading={rejecting}
                  onClick={() => reject({ id: reviewing.id, reason: rejectionReason })}
                >
                  <XCircle className="h-4 w-4" /> Reject Application
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
