import { get } from "@/util/Http";
import {
    getAllDelivery,
    getDeliveryDetail,
    getOrderDetail,
} from "@/zustand/services/order";
import { useQuery } from "@tanstack/react-query";

export const useAllOrder = (params: Record<string, any> = {}) => {
    const { email, status, page = 1, limit = 10 } = params;

    const queryParams = {
        email,
        page,
        limit,
        ...(status && status !== "all" ? { status } : {}),
    };

    return useQuery({
        queryKey: ["order-admin", queryParams],
        queryFn: async () => {
            const res = await get("/order/admin", {
                params: queryParams,
            });
            return res.data;
        },
    });
};
export const useOrderDetail = (id?: string) =>
    useQuery({
        queryKey: ["order-detail", id],
        queryFn: () => getOrderDetail(id!),
        enabled: !!id,
    });

export const useAnalytics = () => {
    return useQuery({
        queryKey: ["order-analytics"],
        queryFn: async () => {
            const res = await get("/order/admin/analytics");
            return res.data;
        },
    });
};

export const useDeliveries = (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    return useQuery({
        queryKey: ["deliveries", params],
        queryFn: () => getAllDelivery(params),
    });
};

export const useDeliveryDetail = (id?: string) =>
    useQuery({
        queryKey: ["delivery-detail", id],
        queryFn: () => getDeliveryDetail(id!),
        enabled: !!id,
    });
