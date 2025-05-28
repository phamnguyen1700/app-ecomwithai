import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/zustand/services/product";

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts
    })
}