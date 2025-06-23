import { addToCartAPI } from "@/zustand/services/cart/addToCart";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCartAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};