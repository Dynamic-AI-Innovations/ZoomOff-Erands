import { RunnerPortalShell } from "@/components/layout/RunnerPortalShell";
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <RunnerPortalShell>{children}</RunnerPortalShell>;
}
