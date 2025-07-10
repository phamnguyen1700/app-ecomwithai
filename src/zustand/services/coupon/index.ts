import { get } from "@/util/Http";

export const getCoupons = async (params: Record<string, any>) => {
    const res = await get("/coupon/admin/all", { params });
    return res.data;
};
