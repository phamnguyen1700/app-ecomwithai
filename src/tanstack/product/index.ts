import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/zustand/services/product/product";

export const useProducts = () => {
    return useQuery({
        queryKey: ['product'],
        queryFn: getAllProducts
    })
}