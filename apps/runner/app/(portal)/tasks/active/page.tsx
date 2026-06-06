import type { Metadata } from "next";
import { ActiveTask } from "@/components/tasks/ActiveTask";

export const metadata: Metadata = { title: "Active Task" };

export default function ActiveTaskPage() {
  return <ActiveTask />;
}
