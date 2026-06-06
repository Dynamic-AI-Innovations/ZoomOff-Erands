"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@zoomoff/api-client";
import { Button, Card, Badge, useToast, OTPInput, cn } from "@zoomoff/ui";
import { Navigation, MapPin, Camera, CheckCircle2, AlertTriangle, ExternalLink, CheckSquare, Square } from "lucide-react";

type TaskStage = "en_route_pickup" | "arrived_pickup" | "in_progress" | "heading_destination" | "proof_required";

const STAGES: { key: TaskStage; label: string; action: string }[] = [
  { key: "en_route_pickup", label: "En Route to Pickup", action: "Arrived at Pickup" },
  { key: "arrived_pickup", label: "Arrived at Pickup", action: "Start Task" },
  { key: "in_progress", label: "Task In Progress", action: "Heading to Destination" },
  { key: "heading_destination", label: "Heading to Destination", action: "Submit Proof of Completion" },
  { key: "proof_required", label: "Submit Proof", action: "" },
];

const ISSUE_TYPES = [
  "item_not_available",
  "location_inaccessible",
  "customer_unresponsive",
  "safety_concern",
] as const;

export function ActiveTask() {
  const { toast } = useToast();
  const router = useRouter();
  const qc = useQueryClient();
  const [stage, setStage] = React.useState<TaskStage>("en_route_pickup");
  const [proofPhoto, setProofPhoto] = React.useState<File | null>(null);
  const [otp, setOtp] = React.useState("");
  const [showIssue, setShowIssue] = React.useState(false);
  const [checklist, setChecklist] = React.useState<Record<string, boolean>>({});

  const { data: activeTask } = useQuery({
    queryKey: ["runner-active-task"],
    queryFn: () => apiClient.get<{ data: { id: string; category: string; description: string; pickup: { address: string }; destination: { address: string }; checklistItems?: string[] } }>("/runner/tasks/active").then(r => r.data.data),
  });

  const { mutate: updateStage, isPending } = useMutation({
    mutationFn: (newStage: string) => apiClient.post(`/tasks/${activeTask?.id}/status`, { stage: newStage }),
    onSuccess: (_, newStage) => {
      if (newStage === "arrived_pickup") setStage("arrived_pickup");
      else if (newStage === "in_progress") setStage("in_progress");
      else if (newStage === "heading_destination") setStage("heading_destination");
      else if (newStage === "proof_required") setStage("proof_required");
      qc.invalidateQueries({ queryKey: ["runner-active-task"] });
    },
  });

  const { mutate: submitProof, isPending: submitting } = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (proofPhoto) fd.append("photo", proofPhoto);
      if (otp) fd.append("otp", otp);
      return apiClient.post(`/tasks/${activeTask?.id}/complete`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => {
      toast({ type: "success", title: "Task completed!", description: "Payment will be released after customer confirms." });
      router.push("/dashboard");
    },
    onError: () => toast({ type: "error", title: "Invalid OTP or missing proof" }),
  });

  if (!activeTask) {
    return (
      <div className="max-w-lg mx-auto p-4 text-center py-20">
        <p className="text-sm text-zo-muted">No active task. Check the feed for new tasks.</p>
        <Button variant="primary" size="sm" className="mt-4" asChild>
          <a href="/tasks/feed">View Task Feed</a>
        </Button>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex(s => s.key === stage);
  const currentStage = STAGES[currentStageIndex];

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-brand-charcoal capitalize">
          {activeTask.category?.replace(/_/g, " ")}
        </h1>
        <Badge variant="warning" dot>{currentStage?.label}</Badge>
      </div>

      {/* Navigation CTA */}
      <Card className="bg-brand-charcoal border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">
              {stage === "in_progress" || stage === "heading_destination" ? "Destination" : "Pickup"}
            </p>
            <p className="text-sm font-semibold text-white">
              {(stage === "in_progress" || stage === "heading_destination")
                ? activeTask.destination.address
                : activeTask.pickup.address}
            </p>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(activeTask.pickup.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-brand-gold px-3 py-2 text-xs font-bold text-brand-charcoal"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" /> Navigate
          </a>
        </div>
      </Card>

      {/* Shopping checklist */}
      {activeTask.checklistItems && activeTask.checklistItems.length > 0 && (
        <Card>
          <h2 className="font-semibold text-brand-charcoal mb-3">Shopping Checklist</h2>
          <div className="space-y-2">
            {activeTask.checklistItems.map((item, i) => (
              <button key={i} onClick={() => setChecklist(c => ({ ...c, [item]: !c[item] }))}
                className="flex w-full items-center gap-3 rounded-xl border border-zo-border p-2.5 text-left hover:bg-zo-bg-light">
                {checklist[item] ? (
                  <CheckSquare className="h-5 w-5 text-zo-success shrink-0" aria-hidden="true" />
                ) : (
                  <Square className="h-5 w-5 text-zo-muted shrink-0" aria-hidden="true" />
                )}
                <span className={cn("text-sm", checklist[item] && "line-through text-zo-muted")}>{item}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Proof of completion */}
      {stage === "proof_required" ? (
        <Card>
          <h2 className="font-semibold text-brand-charcoal mb-4">Proof of Completion</h2>
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-dashed border-zo-border p-6 text-center cursor-pointer hover:border-brand-gold" onClick={() => document.getElementById("proof-photo")?.click()}>
              <Camera className="h-8 w-8 text-zo-muted mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-brand-charcoal">{proofPhoto ? proofPhoto.name : "Upload proof photo"}</p>
              <p className="text-xs text-zo-muted mt-1">At least 1 photo required</p>
              <input id="proof-photo" type="file" accept="image/*" className="hidden" onChange={e => setProofPhoto(e.target.files?.[0] ?? null)} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-brand-charcoal">Customer OTP (ask customer for 4-digit code)</p>
              <OTPInput length={4} value={otp} onChange={setOtp} />
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!proofPhoto || otp.length < 4}
              loading={submitting}
              onClick={() => submitProof()}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Submit & Complete Task
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="primary"
          size="xl"
          className="w-full"
          loading={isPending}
          onClick={() => {
            const next = STAGES[currentStageIndex + 1];
            if (next) updateStage(next.key);
          }}
        >
          {currentStage?.action}
        </Button>
      )}

      {/* Report issue */}
      <button onClick={() => setShowIssue(true)} className="flex w-full items-center justify-center gap-1.5 text-xs text-zo-muted hover:text-zo-error">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Report an issue
      </button>

      {showIssue && (
        <Card className="border-zo-error bg-zo-error-light">
          <h3 className="font-semibold text-zo-error mb-3 text-sm">Report Task Issue</h3>
          <div className="grid grid-cols-2 gap-2">
            {ISSUE_TYPES.map(issue => (
              <button key={issue} className="rounded-xl border border-zo-error/30 bg-white px-3 py-2 text-xs font-medium text-zo-error hover:bg-zo-error hover:text-white transition-colors capitalize">
                {issue.replace(/_/g, " ")}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={() => setShowIssue(false)}>Cancel</Button>
        </Card>
      )}
    </div>
  );
}
