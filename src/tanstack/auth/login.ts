import { getMe } from "@/zustand/services/auth/getMe";
import { loginApi } from "@/zustand/services/auth/login";
import { useAuthStore } from "@/zustand/store/userAuth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const setTokens = useAuthStore((state) => state.setTokens);

    return useMutation({
        mutationFn: async (credentials: {
            email: string;
            password: string;
        }) => {
            const tokenRes = await loginApi(credentials);
            setTokens(tokenRes);

            const user = await getMe();
            return { ...user, ...tokenRes };
        },
        onSuccess: (userWithToken) => {
            setUser(userWithToken);
            toast.success("Đăng nhập thành công!");
        },
        onError: () => {
            toast.error("Đăng nhập thất bại!");
        },
    });
};
