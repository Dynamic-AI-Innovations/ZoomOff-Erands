import { z } from "zod";

export const TASK_CATEGORIES = [
  "grocery_shopping",
  "document_pickup_delivery",
  "pharmacy_run",
  "bill_payment",
  "banking_errand",
  "queue_standing",
  "parcel_delivery",
  "administrative_errand",
  "home_errand",
  "other",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  grocery_shopping: "Grocery Shopping",
  document_pickup_delivery: "Document Pickup/Delivery",
  pharmacy_run: "Pharmacy Run",
  bill_payment: "Bill Payment",
  banking_errand: "Banking Errand",
  queue_standing: "Queue Standing",
  parcel_delivery: "Parcel Delivery",
  administrative_errand: "Administrative Errand",
  home_errand: "Home Errand",
  other: "Other",
};

export const addressSchema = z.object({
  address: z.string().min(5, "Enter a valid address"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  placeId: z.string().optional(),
});

export const createTaskStep1Schema = z.object({
  category: z.enum(TASK_CATEGORIES, { required_error: "Select a task type" }),
  categoryOther: z.string().optional(),
});

export const createTaskStep2Schema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
});

export const createTaskStep3Schema = z.object({
  pickup: addressSchema,
  destination: addressSchema,
  waypoints: z.array(addressSchema).max(3).optional(),
});

export const scheduleTypeSchema = z.enum(["instant", "today", "scheduled"]);
export type ScheduleType = z.infer<typeof scheduleTypeSchema>;

export const createTaskStep5Schema = z.discriminatedUnion("scheduleType", [
  z.object({
    scheduleType: z.literal("instant"),
  }),
  z.object({
    scheduleType: z.literal("today"),
    scheduledTime: z.string().min(1, "Select a time"),
  }),
  z.object({
    scheduleType: z.literal("scheduled"),
    scheduledDate: z.string().min(1, "Select a date"),
    scheduledTime: z.string().min(1, "Select a time"),
  }),
]);

export const createTaskStep6Schema = z.object({
  specialInstructions: z.string().max(500).optional(),
  isUrgent: z.boolean().default(false),
});

export type CreateTaskStep1Input = z.infer<typeof createTaskStep1Schema>;
export type CreateTaskStep2Input = z.infer<typeof createTaskStep2Schema>;
export type CreateTaskStep3Input = z.infer<typeof createTaskStep3Schema>;
export type CreateTaskStep5Input = z.infer<typeof createTaskStep5Schema>;
export type CreateTaskStep6Input = z.infer<typeof createTaskStep6Schema>;
export type AddressInput = z.infer<typeof addressSchema>;
