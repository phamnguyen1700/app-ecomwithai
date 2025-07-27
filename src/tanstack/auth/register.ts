import { post } from "@/util/Http";
import { getMe } from "@/zustand/services/auth/getMe";
import { loginApi } from "@/zustand/services/auth/login";
import { useAuthStore } from "@/zustand/store/userAuth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useRegister = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const setTokens = useAuthStore((state) => state.setTokens);
    const router = useRouter();

    return useMutation({
        mutationFn: async (payload: { email: string; password: string }) => {
            await post("user/register", payload);

            const tokens = await loginApi(payload);
            setTokens(tokens);

            const user = await getMe();
            setUser(user);

            await post("user/verify-email");

            return user;
        },
        onSuccess: (userWithToken) => {
            setUser(userWithToken);
            toast.success("Đăng ký thành công! Vui lòng kiểm tra email.");
            router.push("/verify-email");
        },
        onError: () => {
            toast.error("Đăng ký thất bại!");
        },
    });
};
