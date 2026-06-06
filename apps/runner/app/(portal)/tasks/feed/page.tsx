import type { Metadata } from "next";
import { TaskFeed } from "@/components/tasks/TaskFeed";

export const metadata: Metadata = { title: "Task Feed" };

export default function TaskFeedPage() {
  return <TaskFeed />;
}
