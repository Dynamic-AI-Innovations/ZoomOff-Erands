"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tasksApi } from "@zoomoff/api-client";
import { Button, Card, Input, Modal, useToast, Badge } from "@zoomoff/ui";
import { AlertTriangle, Upload, X } from "lucide-react";

const DISPUTE_REASONS = [
  "item_not_delivered",
  "wrong_item",
  "damaged_item",
  "runner_behaviour",
  "overcharge",
  "other",
] as const;

const REASON_LABELS: Record<(typeof DISPUTE_REASONS)[number], string> = {
  item_not_delivered: "Item not delivered",
  wrong_item: "Wrong item purchased",
  damaged_item: "Item arrived damaged",
  runner_behaviour: "Runner behaviour",
  overcharge: "Overcharged",
  other: "Other issue",
};

export function DisputesList() {
  const params = useSearchParams();
  const prefilledTaskId = params.get("taskId");
  const { toast } = useToast();
  const [showForm, setShowForm] = React.useState(!!prefilledTaskId);
  const [taskId, setTaskId] = React.useState(prefilledTaskId ?? "");
  const [reason, setReason] = React.useState<(typeof DISPUTE_REASONS)[number] | "">("");
  const [description, setDescription] = React.useState("");

  const { mutate: fileDispute, isPending } = useMutation({
    mutationFn: () =>
      tasksApi.fileDispute(taskId, { reason, description }),
    onSuccess: () => {
      toast({ type: "success", title: "Dispute filed!", description: "We'll review within 48 hours." });
      setShowForm(false);
    },
    onError: () => toast({ type: "error", title: "Could not file dispute" }),
  });

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setShowForm(true)}>
        <AlertTriangle className="h-4 w-4" aria-hidden="true" /> File a Dispute
      </Button>

      <Card className="text-center py-12">
        <AlertTriangle className="h-10 w-10 text-zo-border mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm font-semibold text-brand-charcoal">No disputes filed</p>
        <p className="text-xs text-zo-muted mt-1">Disputes can be filed within 48 hours of task completion</p>
      </Card>

      <Modal open={showForm} onOpenChange={setShowForm} title="File a Dispute" size="md">
        <div className="space-y-4">
          <Input
            label="Task ID"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="Paste your task ID"
            helperText="Found in your task history or receipt"
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-charcoal">Reason</label>
            <div className="grid grid-cols-2 gap-2">
              {DISPUTE_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    reason === r
                      ? "border-brand-gold bg-brand-gold/10 text-brand-charcoal"
                      : "border-zo-border text-zo-muted hover:border-brand-charcoal"
                  }`}
                >
                  {REASON_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-charcoal">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
              rows={4}
              placeholder="Describe what went wrong in detail..."
              className="w-full rounded-xl border border-zo-border px-3 py-2.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            />
            <p className="text-xs text-right text-zo-muted">{description.length}/1000</p>
          </div>

          <p className="text-xs text-zo-muted bg-zo-warning-light border border-zo-warning/20 rounded-xl p-3">
            ⏱ SLA: disputes are resolved within 48 hours. You'll be notified via email and in-app.
          </p>

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={!taskId || !reason || description.trim().length < 10}
              loading={isPending}
              onClick={() => fileDispute()}
            >
              Submit Dispute
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
