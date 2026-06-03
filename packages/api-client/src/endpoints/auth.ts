import { apiClient } from "../client";
import type { LoginResponse, RegisterResponse, User } from "../types";

// All functions return response.data (the API payload), not the raw Axios response,
// so TanStack Query can infer types without needing AxiosResponse imports in consumers.

export const authApi = {
  login: async (data: { identifier: string; password: string }): Promise<LoginResponse> => {
    const res = await apiClient.post<{ data: LoginResponse }>("/auth/login", data);
    return res.data.data;
  },

  loginWithMfa: async (data: { identifier: string; password: string; totpCode: string }): Promise<LoginResponse> => {
    const res = await apiClient.post<{ data: LoginResponse }>("/auth/login/mfa", data);
    return res.data.data;
  },

  verifyMfa: async (data: { code: string }): Promise<LoginResponse> => {
    const res = await apiClient.post<{ data: LoginResponse }>("/auth/mfa/verify", data);
    return res.data.data;
  },

  register: async (data: {
    phone: string;
    email: string;
    name: string;
    password: string;
    role?: "customer" | "runner";
  }): Promise<RegisterResponse> => {
    const res = await apiClient.post<{ data: RegisterResponse }>("/auth/register", data);
    return res.data.data;
  },

  verifyPhone: async (data: { phone: string; otp: string }): Promise<{ verified: boolean }> => {
    const res = await apiClient.post<{ data: { verified: boolean } }>("/auth/verify-phone", data);
    return res.data.data;
  },

  resendOtp: async (data: { phone: string }): Promise<{ sent: boolean }> => {
    const res = await apiClient.post<{ data: { sent: boolean } }>("/auth/resend-otp", data);
    return res.data.data;
  },

  forgotPassword: async (data: { identifier: string }): Promise<{ sent: boolean }> => {
    const res = await apiClient.post<{ data: { sent: boolean } }>("/auth/forgot-password", data);
    return res.data.data;
  },

  resetPassword: async (data: { token: string; password: string }): Promise<{ success: boolean }> => {
    const res = await apiClient.post<{ data: { success: boolean } }>("/auth/reset-password", data);
    return res.data.data;
  },

  logout: async (): Promise<{ success: boolean }> => {
    const res = await apiClient.post<{ data: { success: boolean } }>("/auth/logout");
    return res.data.data;
  },

  refresh: async (): Promise<{ tokens: { accessToken: string; expiresIn: number }; user: User }> => {
    const res = await apiClient.post<{ data: { tokens: { accessToken: string; expiresIn: number }; user: User } }>("/auth/refresh");
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<{ data: User }>("/auth/me");
    return res.data.data;
  },
};
