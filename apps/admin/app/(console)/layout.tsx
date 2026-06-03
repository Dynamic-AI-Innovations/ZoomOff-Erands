import { AdminConsoleShell } from "@/components/layout/AdminConsoleShell";
export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <AdminConsoleShell>{children}</AdminConsoleShell>;
}
