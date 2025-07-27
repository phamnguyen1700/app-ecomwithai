import { get, patch, post } from "@/util/Http";
import { UserResponse } from "@/types/user";

export const getAllUser = async (filter = {}) => {
    const response = await get<UserResponse>("/user", {
        params: filter,
    });
    return response.data;
};

export const updateRole = async (userId: string, role: "admin" | "user") => {
    const response = await patch(`/user/role/${userId}`, {
        role,
    });
    return response.data;
};


//forgot password
export const forgotPass = async (email: string) => {
    const response = await post("/user/forgot-password", {
        email,
    });
    return response.data;
};

//reset password
export const resetPass = async (email: string, otp: string, newPassword: string) => {
    const res = await post("/user/reset-password", {
        email,
        otp,
        newPassword,
    });
    return res.data;
}
