import type { Metadata } from "next";
import { BusinessRegisterForm } from "./BusinessRegisterForm";

export const metadata: Metadata = { title: "Business Registration | ZoomOff" };

export default function BusinessRegisterPage() {
  return <BusinessRegisterForm />;
}
