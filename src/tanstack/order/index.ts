import { useQuery } from "@tanstack/react-query";
import { getAllOrder } from "@/zustand/services/order";

export const useAllOrder = (params: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["allOrder", params],
        queryFn: () => getAllOrder(params),
    });
};

