import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/zustand/services/product";

export const useProducts = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: () => getAllProducts(page, limit, search),
  });
};
