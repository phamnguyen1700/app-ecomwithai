import { LoginTypes } from "@/types/user";
import { post } from "@/util/Http";

export const loginApi = async (payload: {
    email: string;
    password: string;
}) => {
    const res =await post<LoginTypes>("user/login", payload);        
    return res.data;
};
