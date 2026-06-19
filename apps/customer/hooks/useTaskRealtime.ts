"use client";

import * as React from "react";
import { supabase } from "@zoomoff/api-client";
import type { TaskStatus } from "@zoomoff/api-client";

interface TaskRealtimePayload {
  id: string;
  status: TaskStatus;
  runner_id: string | null;
  updated_at: string;
}

export function useTaskRealtime(
  taskId: string,
  onUpdate: (payload: TaskRealtimePayload) => void
) {
  React.useEffect(() => {
    const channel = supabase
      .channel(`task-${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tasks",
          filter: `id=eq.${taskId}`,
        },
        (payload) => {
          onUpdate(payload.new as TaskRealtimePayload);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [taskId, onUpdate]);
}
