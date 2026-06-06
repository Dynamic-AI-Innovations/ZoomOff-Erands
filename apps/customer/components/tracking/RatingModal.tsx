"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { tasksApi } from "@zoomoff/api-client";
import { Button, Modal, Avatar, useToast, cn } from "@zoomoff/ui";
import type { TaskRunner } from "@zoomoff/api-client";

interface Props { taskId: string; runner: TaskRunner; onClose: () => void; }

export function RatingModal({ taskId, runner, onClose }: Props) {
  const { toast } = useToast();
  const [score, setScore] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [review, setReview] = React.useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => tasksApi.rate(taskId, { score, review: review.trim() || undefined }),
    onSuccess: () => {
      toast({ type: "success", title: "Rating submitted!", description: "Thank you for your feedback." });
      onClose();
    },
    onError: () => toast({ type: "error", title: "Could not submit rating" }),
  });

  return (
    <Modal open onOpenChange={onClose} title="Rate your runner" size="sm">
      <div className="space-y-5 text-center">
        <div className="flex flex-col items-center gap-3">
          <Avatar name={runner.name} src={runner.photoUrl} size="lg" tier={runner.tier} />
          <p className="font-semibold text-brand-charcoal">{runner.name}</p>
        </div>

        <div>
          <p className="text-sm text-zo-muted mb-3">How was your experience?</p>
          <div className="flex justify-center gap-2" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={score === s}
                aria-label={`${s} star${s > 1 ? "s" : ""}`}
                onClick={() => setScore(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    s <= (hover || score) ? "text-brand-gold fill-brand-gold" : "text-zo-border"
                  )}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          {score > 0 && (
            <p className="text-sm font-semibold text-brand-charcoal mt-2">
              {["", "Poor", "Fair", "Good", "Great", "Excellent!"][score]}
            </p>
          )}
        </div>

        <div className="text-left">
          <label className="text-sm font-medium text-brand-charcoal">Leave a review (optional)</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 500))}
            rows={3}
            placeholder="Share your experience..."
            className="mt-1.5 w-full rounded-xl border border-zo-border px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" size="lg" className="flex-1" onClick={onClose}>Skip</Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={score === 0}
            loading={isPending}
            onClick={() => mutate()}
          >
            Submit Rating
          </Button>
        </div>
      </div>
    </Modal>
  );
}
