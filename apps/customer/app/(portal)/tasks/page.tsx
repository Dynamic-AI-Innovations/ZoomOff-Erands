import type { Metadata } from "next";
import { TaskHistoryList } from "@/components/tasks/TaskHistoryList";

export const metadata: Metadata = { title: "My Tasks" };

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">My Errands</h1>
        <p className="text-sm text-zo-muted mt-1">All your errands — active, completed and cancelled</p>
      </div>
      <TaskHistoryList />
    </div>
  );
}
