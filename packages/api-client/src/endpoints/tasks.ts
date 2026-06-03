import { apiClient } from "../client";
import type { Task, PriceBreakdown } from "../types";
import type { TaskCategory, ScheduleType } from "@zoomoff/validators";

export interface CreateTaskPayload {
  category: TaskCategory;
  categoryOther?: string;
  description: string;
  specialInstructions?: string;
  isUrgent?: boolean;
  pickup: { address: string; lat: number; lng: number };
  destination: { address: string; lat: number; lng: number };
  waypoints?: Array<{ address: string; lat: number; lng: number }>;
  scheduleType: ScheduleType;
  scheduledAt?: string;
  attachments?: string[];
  orgId?: string;
  departmentTag?: string;
}

export const tasksApi = {
  estimatePrice: (payload: Omit<CreateTaskPayload, "attachments">) =>
    apiClient.post<{ data: PriceBreakdown }>("/tasks/estimate", payload),

  create: (payload: CreateTaskPayload) =>
    apiClient.post<{ data: Task }>("/tasks", payload),

  getById: (taskId: string) =>
    apiClient.get<{ data: Task }>(`/tasks/${taskId}`),

  list: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    runnerId?: string;
  }) => apiClient.get<{ data: Task[]; meta: { page: number; total: number } }>("/tasks", { params }),

  cancel: (taskId: string, reason?: string) =>
    apiClient.post<{ data: { cancelled: boolean; fee: number } }>(`/tasks/${taskId}/cancel`, {
      reason,
    }),

  confirm: (taskId: string) =>
    apiClient.post<{ data: { confirmed: boolean } }>(`/tasks/${taskId}/confirm`),

  rate: (taskId: string, payload: { score: number; review?: string }) =>
    apiClient.post<{ data: { rated: boolean } }>(`/tasks/${taskId}/rate`, payload),

  getChat: (taskId: string, params?: { cursor?: string; limit?: number }) =>
    apiClient.get<{ data: ChatMessage[]; meta: { nextCursor: string | null } }>(
      `/tasks/${taskId}/chat`,
      { params }
    ),

  sendMessage: (taskId: string, payload: { content: string; type: "text" | "image" }) =>
    apiClient.post<{ data: ChatMessage }>(`/tasks/${taskId}/chat`, payload),

  uploadAttachment: (formData: FormData) =>
    apiClient.post<{ data: { url: string } }>("/tasks/attachments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  fileDispute: (
    taskId: string,
    payload: { reason: string; description: string; evidenceUrls?: string[] }
  ) => apiClient.post<{ data: { disputeId: string } }>(`/tasks/${taskId}/dispute`, payload),
};

interface ChatMessage {
  id: string;
  taskId: string;
  senderId: string;
  senderRole: "customer" | "runner";
  content: string;
  type: "text" | "image";
  sentAt: string;
}
