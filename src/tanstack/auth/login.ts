import { getMe } from "@/zustand/services/auth/getMe";
import { loginApi } from "@/zustand/services/auth/login";
import { useAuthStore } from "@/zustand/store/userAuth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const setTokens = useAuthStore((state) => state.setTokens);
    const router = useRouter();
    return useMutation({
        mutationFn: async (credentials: {
            email: string;
            password: string;
        }) => {
            const tokenRes = await loginApi(credentials);
            setTokens(tokenRes);

            const user = await getMe();
            return user;
        },
        onSuccess: async (userWithToken) => {
            setUser(userWithToken);
            // if (!userWithToken.isVerified) {
            //     try {
            //         await post("/user/verify-email");
            //         toast.warn(
            //             "Tài khoản chưa xác thực. Đã gửi email xác thực!"
            //         );
            //         router.push("/verify-email");
            //     } catch {
            //         toast.error("Không thể gửi email xác thực.");
            //     }
            // } else {
            toast.success("Đăng nhập thành công!");
            if (userWithToken.role === "admin") {
                router.push("/manage/dashboard");
            } else {
                router.push("/ecom/home");
            }

            // }
        },
        onError: () => {
            toast.error("Đăng nhập thất bại!");
        },
    });
};
