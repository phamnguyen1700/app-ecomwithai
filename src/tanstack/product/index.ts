import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/zustand/services/product/product";

export const useProducts = (params = "") => {
    return useQuery({
        queryKey: ['product', params],
        queryFn:() => getAllProducts(params),
        placeholderData: keepPreviousData,
    })
}