import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllUser, forgotPass, resetPass, updateRole } from "@/zustand/services/user";
import { toast } from "react-toastify";

export const useAllUser = (params: Record<string, any> = {}) => {
    return useQuery<any>({
        queryKey: ["allUser", params],
        queryFn: () => getAllUser(params),
    });
};

export const updateRoleMutation = () => {
    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: "admin" | "user" }) => updateRole(userId, role),
        onSuccess: () => {
            toast.success("Cập nhật vai trò thành công");
        },
        onError: () => {
            toast.error("Cập nhật vai trò thất bại");
        },
    });
};


export const useForgotPass = () => {
    return useMutation({
        mutationFn: (email: string) => forgotPass(email),
        onSuccess: () => {
            toast.success("Chúng tôi đã gửi mã xác nhận đến email của bạn");
        },
        onError: () => {
            toast.error("Yêu cầu đổi mật khẩu không thành công");
        },
    });
};

export const useResetPass = () => {
    return useMutation({
        mutationFn: ({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }) => 
            resetPass(email, otp, newPassword),
        onSuccess: () => {
            toast.success("Đổi mật khẩu thành công");
        },
        onError: () => {
            toast.error("Đổi mật khẩu thất bại");
        },
    }); 
};
    