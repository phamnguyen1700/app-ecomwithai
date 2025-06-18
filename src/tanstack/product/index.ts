import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getAllProducts,
    getProductDetail,
} from "@/zustand/services/product/product";

export const useProducts = (params: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["product", params],
        queryFn: () => getAllProducts(params),
        placeholderData: keepPreviousData,
    });
};
export const useProductDetail = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductDetail(id),
        enabled: !!id,
    });
};
