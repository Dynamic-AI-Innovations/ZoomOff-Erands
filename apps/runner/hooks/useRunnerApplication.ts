"use client";

import * as React from "react";
import { supabase } from "@zoomoff/api-client";
import { useAuthStore } from "@zoomoff/auth";

export type VehicleType = "motorcycle" | "bicycle" | "car" | "tricycle";
export type IdType = "NIN" | "drivers_license" | "international_passport" | "voters_card";

export interface RunnerApplicationPayload {
  id_type: IdType;
  id_number: string;
  vehicle_type: VehicleType;
  bio: string;
  categories: string[];
}

type Status = "idle" | "loading" | "success" | "error";

export function useRunnerApplication() {
  const user = useAuthStore((s) => s.user);
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function submit(payload: RunnerApplicationPayload) {
    if (!user) {
      setError("Not authenticated");
      return false;
    }

    setStatus("loading");
    setError(null);

    const { error: sbError } = await supabase.from("runner_applications").insert({
      user_id: user.id,
      id_type: payload.id_type,
      id_number: payload.id_number,
      vehicle_type: payload.vehicle_type,
      bio: payload.bio,
      categories: payload.categories,
      status: "pending",
    });

    if (sbError) {
      setStatus("error");
      setError(sbError.message);
      return false;
    }

    setStatus("success");
    return true;
  }

  return { submit, status, error, isLoading: status === "loading" };
}
