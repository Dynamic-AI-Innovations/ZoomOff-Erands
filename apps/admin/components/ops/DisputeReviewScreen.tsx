"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@zoomoff/api-client";
import { Button, Badge, Card, useToast } from "@zoomoff/ui";
import { CheckCircle2, XCircle, AlertTriangle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Resolution = "refund_full" | "refund_partial" | "dismissed" | "split";

interface DisputeDetail {
  id: string;
  taskId: string;
  status: string;
  reason: string;
  description: string;
  customerName: string;
  runnerName: string;
  taskAmount: number;
  filedAt: string;
  slaHoursLeft: number;
  timeline: { timestamp: string; event: string }[];
  chatLog: { sender: string; content: string; sentAt: string }[];
  evidence: string[];
  runnerResponse: string | null;
}

function formatNaira(n: number) { return `₦${n.toLocaleString("en-NG")}`; }
function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", { timeZone: "Africa/Lagos", hour12: true });
}

export function DisputeReviewScreen({ disputeId }: { disputeId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const qc = useQueryClient();
  const [resolution, setResolution] = React.useState<Resolution | null>(null);
  const [refundAmount, setRefundAmount] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const { data: dispute, isLoading } = useQuery({
    queryKey: ["dispute", disputeId],
    queryFn: () => apiClient.get<{ data: DisputeDetail }>(`/admin/disputes/${disputeId}`).then(r => r.data.data),
  });

  const { mutate: resolve, isPending } = useMutation({
    mutationFn: () => apiClient.post(`/admin/disputes/${disputeId}/resolve`, {
      resolution,
      refundAmount: refundAmount ? parseInt(refundAmount) : undefined,
      notes,
    }),
    onSuccess: () => {
      toast({ type: "success", title: "Dispute resolved", description: "Payments processed automatically." });
      qc.invalidateQueries({ queryKey: ["dispute", disputeId] });
      router.push("/disputes");
    },
    onError: () => toast({ type: "error", title: "Resolution failed" }),
  });

  const { mutate: escalate } = useMutation({
    mutationFn: () => apiClient.post(`/admin/disputes/${disputeId}/escalate`, { notes }),
    onSuccess: () => {
      toast({ type: "info", title: "Escalated to L2 Admin" });
      router.push("/disputes");
    },
  });

  if (isLoading || !dispute) {
    return <div className="text-center py-20 text-gray-400">Loading dispute...</div>;
  }

  const RESOLUTIONS: { key: Resolution; label: string; desc: string }[] = [
    { key: "refund_full", label: "Full Refund to Customer", desc: `${formatNaira(dispute.taskAmount)} back to customer wallet` },
    { key: "refund_partial", label: "Partial Refund", desc: "Set custom refund amount below" },
    { key: "dismissed", label: "Dismiss — Runner Paid", desc: "Escrow released to runner in full" },
    { key: "split", label: "Split Decision", desc: "Partial refund + partial runner pay" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/disputes" className="text-gray-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Dispute #{disputeId.slice(0, 8)}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant={dispute.slaHoursLeft < 6 ? "error" : "warning"} dot>
              <Clock className="h-3 w-3 mr-1" aria-hidden="true" /> {dispute.slaHoursLeft}h remaining
            </Badge>
            <Badge variant="muted">{dispute.reason.replace(/_/g, " ")}</Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Left: Evidence */}
        <div className="space-y-4">
          {/* Task timeline */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold text-white mb-3">Task Timeline</h2>
            <ol className="space-y-2">
              {dispute.timeline.map((event, i) => (
                <li key={i} className="flex gap-3 text-xs">
                  <span className="text-gray-500 shrink-0 w-28">{formatTime(event.timestamp)}</span>
                  <span className="text-gray-300">{event.event}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Chat log */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold text-white mb-3">Task Chat Log</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dispute.chatLog.length === 0 ? (
                <p className="text-xs text-gray-500">No messages</p>
              ) : (
                dispute.chatLog.map((msg, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-semibold text-gray-300">{msg.sender}: </span>
                    <span className="text-gray-400">{msg.content}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Evidence */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-semibold text-white mb-3">Evidence Media</h2>
            {dispute.evidence.length === 0 ? (
              <p className="text-xs text-gray-500">No evidence uploaded</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {dispute.evidence.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Media {i+1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Parties + Resolution */}
        <div className="space-y-4">
          {/* Parties */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Customer Complaint</p>
              <p className="text-sm text-gray-300 mt-1">{dispute.description}</p>
              <p className="text-xs text-gray-500 mt-1">Filed by: {dispute.customerName}</p>
            </div>
            <div className="border-t border-white/10 pt-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Runner Response</p>
              <p className="text-sm text-gray-300 mt-1">{dispute.runnerResponse ?? "No response yet"}</p>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Task Amount</span>
              <span className="font-bold text-white">{formatNaira(dispute.taskAmount)}</span>
            </div>
          </div>

          {/* Resolution */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <h2 className="font-semibold text-white">Resolution</h2>
            {RESOLUTIONS.map(r => (
              <button key={r.key} onClick={() => setResolution(r.key)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${resolution === r.key ? "border-brand-gold bg-brand-gold/10" : "border-white/10 hover:border-white/30"}`}
                aria-pressed={resolution === r.key}>
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border mt-0.5 ${resolution === r.key ? "border-brand-gold bg-brand-gold" : "border-white/30"}`}>
                  {resolution === r.key && <div className="h-2 w-2 rounded-full bg-brand-charcoal" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{r.label}</p>
                  <p className="text-xs text-gray-400">{r.desc}</p>
                </div>
              </button>
            ))}

            {(resolution === "refund_partial" || resolution === "split") && (
              <input
                type="number"
                value={refundAmount}
                onChange={e => setRefundAmount(e.target.value)}
                placeholder="Refund amount (₦)"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              />
            )}

            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Resolution notes (required)..."
              className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            />

            <div className="flex gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                disabled={!resolution || !notes.trim()}
                loading={isPending}
                onClick={() => resolve()}
              >
                <CheckCircle2 className="h-4 w-4" /> Resolve
              </Button>
              <Button
                variant="outline"
                size="md"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => escalate()}
              >
                <AlertTriangle className="h-4 w-4" /> Escalate L2
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
