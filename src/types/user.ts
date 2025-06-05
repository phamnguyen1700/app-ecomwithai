export interface User {
  email: string
  token: string
}

export interface AuthState {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}