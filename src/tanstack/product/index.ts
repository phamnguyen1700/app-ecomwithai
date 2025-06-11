import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductDetail } from "@/zustand/services/product/product";

export const useProducts = () => {
    return useQuery({
        queryKey: ['product'],
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