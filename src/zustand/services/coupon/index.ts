import { CouponResponse } from "@/types/coupon";
import { get } from "@/util/Http";

export const getCoupons = async (
    params: Record<string, any>
): Promise<CouponResponse> => {
    const res = await get<CouponResponse>("/coupon/admin/all", { params });
    return res.data;
};
