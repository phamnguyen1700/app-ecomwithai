import { getAllDelivery, getDeliveryDetail } from "@/zustand/services/delievery";
import { useQuery } from "@tanstack/react-query";

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
