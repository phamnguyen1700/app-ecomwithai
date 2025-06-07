import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductDetail } from "@/zustand/services/product";

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts
    })
};
export const useProductDetail = (id: string) => {
    return useQuery({
      queryKey: ["product", id],
      queryFn: () => getProductDetail(id),
      enabled: !!id,
    });
  };