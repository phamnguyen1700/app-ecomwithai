import { DeliveryDetail, DeliveryListResponse } from "@/types/delievery";
import { get } from "@/util/Http";
import { useQuery } from "@tanstack/react-query";

export const useDeliveries = (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    return useQuery<DeliveryListResponse>({
        queryKey: ["deliveries", params],
        queryFn: async () => {
            const res = await get<DeliveryListResponse>("/delivery/admin", {
                params,
            });
            return res.data;
        },
    });
};

export const useDeliveryDetail = (id?: string) =>
    useQuery<DeliveryDetail>({
        queryKey: ["delivery-detail", id],
        queryFn: async () => {
            const res = await get<DeliveryDetail>(`/delivery/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
