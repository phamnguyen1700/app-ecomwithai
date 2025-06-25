export interface User {
    _id?: string;
    email?: string;
    fullname?: string;
    role?: string;
    avatar?: string;
    accessToken?: string;
    refreshToken?: string;
}
export interface LoginTypes {
    accessToken: string;
    refreshToken: string;
}
export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
    setAccessToken: (accessToken: string) => void;
    setUser: (user: User) => void;
    clearAuth: () => void;
}

export interface UserResponse {
    data: User[];
    metadata: {
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
        limit?: number;
    };
}
