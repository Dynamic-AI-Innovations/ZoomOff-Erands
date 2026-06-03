import { BusinessPortalShell } from "@/components/layout/BusinessPortalShell";
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <BusinessPortalShell>{children}</BusinessPortalShell>;
}
