import { create } from "zustand";

// Minimal user shape — keeps @zoomoff/auth free of api-client dependency.
// The full User type in @zoomoff/api-client extends this.
export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  status: string;
  profilePhotoUrl: string | null;
  createdAt: string;
  lastLogin: string | null;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (accessToken: string, user: AuthUser) => void;
  clearTokens: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: (accessToken, user) => {
    set({ accessToken, user, isAuthenticated: true, isLoading: false });
  },

  clearTokens: () => {
    set({ accessToken: null, user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  updateUser: (partialUser) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...partialUser } });
    }
  },
}));

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function setAuthTokens(accessToken: string, user: AuthUser): void {
  useAuthStore.getState().setTokens(accessToken, user);
}

export function clearAuthTokens(): void {
  useAuthStore.getState().clearTokens();
}
