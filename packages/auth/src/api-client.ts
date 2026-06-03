import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, setAuthTokens, clearAuthTokens } from "./token-manager";
import type { AuthTokens, User } from "@zoomoff/api-client";

const BASE_URL = process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "https://api.zoomoff.africa/api/v1";

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  refreshQueue = [];
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends HTTP-only refresh token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor — attach access token ─────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  // CSRF token for mutating requests
  if (["post", "put", "patch", "delete"].includes(config.method ?? "")) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }
  return config;
});

// ─── Response interceptor — silent token refresh on 401 ───────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<{ data: { tokens: AuthTokens; user: User } }>(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { tokens, user } = response.data.data;
        setAuthTokens(tokens.accessToken, user);
        processQueue(null, tokens.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 429 — rate limit
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"] as string | undefined;
      const err = new Error(`Rate limited. Try again in ${retryAfter ?? "a moment"}.`);
      Object.assign(err, { code: "RATE_LIMITED", retryAfter });
      throw err;
    }

    throw error;
  }
);

// ─── CSRF token helper ─────────────────────────────────────────────────────
function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )zo_csrf=([^;]*)/);
  return match ? (decodeURIComponent(match[1] ?? "") || null) : null;
}

export default apiClient;
