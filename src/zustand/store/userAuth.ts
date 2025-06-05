import { AuthState } from '@/types/user'
import { create } from 'zustand'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
