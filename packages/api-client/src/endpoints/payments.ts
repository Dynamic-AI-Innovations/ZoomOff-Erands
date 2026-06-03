import { apiClient } from "../client";
import type { Payment, Wallet } from "../types";

export const paymentsApi = {
  initiate: (payload: {
    taskId: string;
    method: "card" | "wallet" | "bank_transfer";
    savedCardToken?: string;
  }) =>
    apiClient.post<{
      data: {
        paymentId: string;
        paystackReference?: string;
        paystackAccessCode?: string;
        walletDeducted?: boolean;
        bankTransferDetails?: { accountNumber: string; bankName: string; amount: number };
      };
    }>("/payments/initiate", payload),

  verify: (reference: string) =>
    apiClient.post<{ data: { verified: boolean; paymentId: string } }>("/payments/verify", {
      reference,
    }),

  getWallet: () => apiClient.get<{ data: Wallet }>("/payments/wallet"),

  getTransactions: (params?: {
    page?: number;
    pageSize?: number;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }) =>
    apiClient.get<{ data: Payment[]; meta: { page: number; total: number } }>(
      "/payments/transactions",
      { params }
    ),

  fundWallet: (payload: { amount: number; method: "card" | "bank_transfer" }) =>
    apiClient.post<{
      data: { paystackReference?: string; paystackAccessCode?: string };
    }>("/payments/wallet/fund", payload),

  runnerWithdraw: (payload: { amount: number }) =>
    apiClient.post<{ data: { withdrawalId: string; estimatedSettlement: string } }>(
      "/payments/withdraw",
      payload
    ),
};
