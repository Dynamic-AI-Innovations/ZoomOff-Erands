"use client";

import * as React from "react";
import { AlertOctagon, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button, Modal, useToast } from "@zoomoff/ui";
import { apiClient } from "@zoomoff/api-client";

interface Props { taskId: string; onClose: () => void; }

export function SOSModal({ taskId, onClose }: Props) {
  const { toast } = useToast();
  const [sent, setSent] = React.useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => apiClient.post(`/tasks/${taskId}/sos`),
    onSuccess: () => {
      setSent(true);
      toast({ type: "error", title: "SOS sent!", description: "ZoomOff Safety Team has been notified." });
    },
    onError: () => toast({ type: "error", title: "Could not send SOS. Call support directly." }),
  });

  return (
    <Modal open onOpenChange={onClose} title="Emergency SOS" size="sm">
      <div className="space-y-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zo-error-light mx-auto">
          <AlertOctagon className="h-8 w-8 text-zo-error" aria-hidden="true" />
        </div>

        {!sent ? (
          <>
            <div>
              <p className="font-semibold text-brand-charcoal">Do you need emergency help?</p>
              <p className="text-sm text-zo-muted mt-1">
                Tapping SOS will immediately alert the ZoomOff Safety Team and attempt to call you.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="lg" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button variant="danger" size="lg" className="flex-1" loading={isPending} onClick={() => mutate()}>
                <AlertOctagon className="h-4 w-4" aria-hidden="true" /> Send SOS
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="font-semibold text-zo-success">Safety Team notified!</p>
            <p className="text-sm text-zo-muted">We are trying to reach you. Stay safe.</p>
            <Button variant="danger" size="lg" className="w-full" asChild>
              <a href="tel:+2340000000000">
                <Phone className="h-4 w-4" aria-hidden="true" /> Call Safety Team Directly
              </a>
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
