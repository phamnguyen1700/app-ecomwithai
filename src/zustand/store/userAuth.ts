import { AuthState, User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user: User) => set({ user }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "auth-token",
    }
  )
);
