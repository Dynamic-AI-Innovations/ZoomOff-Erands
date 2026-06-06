import type { Metadata } from "next";
import { LiveTaskBoard } from "@/components/tasks/LiveTaskBoard";

export const metadata: Metadata = { title: "Task Board" };

export default function BusinessTasksPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Task Board</h1>
          <p className="text-sm text-zo-muted mt-1">Live view of all organisation errands</p>
        </div>
      </div>
      <LiveTaskBoard />
    </div>
  );
}
