import { post } from "@/util/Http";

export const loginApi = async (payload: {
    email: string;
    password: string;
}) => {
    const res = post("user/login", payload);
    return res;
};
