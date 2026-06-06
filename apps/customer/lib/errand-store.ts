import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TaskCategory } from "@zoomoff/validators";

export interface AddressField {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}

export interface ErrandDraft {
  // Step 1
  category: TaskCategory | null;
  categoryOther: string;
  // Step 2
  description: string;
  // Step 3
  pickup: AddressField | null;
  destination: AddressField | null;
  waypoints: AddressField[];
  // Step 4
  attachments: string[]; // uploaded S3 URLs
  // Step 5
  scheduleType: "instant" | "today" | "scheduled" | null;
  scheduledDate: string;
  scheduledTime: string;
  // Step 6
  specialInstructions: string;
  isUrgent: boolean;
  // Step 7 (read from API)
  priceEstimate: PriceEstimate | null;
  priceEstimateExpiry: number | null; // unix ms
  // Step 8
  paymentMethod: "wallet" | "card" | "bank_transfer" | null;
  savedCardToken: string | null;
}

export interface PriceEstimate {
  baseRate: number;
  distanceFee: number;
  complexityFee: number;
  surgePremium: number;
  total: number;
  hasSurge: boolean;
}

interface ErrandStoreState {
  draft: ErrandDraft;
  currentStep: number;
  setStep: (step: number) => void;
  updateDraft: (partial: Partial<ErrandDraft>) => void;
  resetDraft: () => void;
}

const INITIAL_DRAFT: ErrandDraft = {
  category: null,
  categoryOther: "",
  description: "",
  pickup: null,
  destination: null,
  waypoints: [],
  attachments: [],
  scheduleType: null,
  scheduledDate: "",
  scheduledTime: "",
  specialInstructions: "",
  isUrgent: false,
  priceEstimate: null,
  priceEstimateExpiry: null,
  paymentMethod: null,
  savedCardToken: null,
};

export const useErrandStore = create<ErrandStoreState>()(
  persist(
    (set) => ({
      draft: INITIAL_DRAFT,
      currentStep: 1,
      setStep: (step) => set({ currentStep: step }),
      updateDraft: (partial) =>
        set((s) => ({ draft: { ...s.draft, ...partial } })),
      resetDraft: () => set({ draft: INITIAL_DRAFT, currentStep: 1 }),
    }),
    {
      name: "zo-errand-draft",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
