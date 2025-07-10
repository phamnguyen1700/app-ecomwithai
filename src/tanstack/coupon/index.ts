import { CouponResponse } from "@/types/coupon";
import { getCoupons } from "@/zustand/services/coupon";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
export const useCoupons = (params: Record<string, any>) => {
    return useQuery<CouponResponse>({
        queryKey: ["coupons", params],
        queryFn: () => getCoupons(params),
        placeholderData: keepPreviousData,
    });
};
