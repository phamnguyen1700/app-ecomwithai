import { addToCartAPI, getCartAPI, removeCartItemAPI, updateQuantityAPI } from "@/zustand/services/cart";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCartAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useCartQuery = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartAPI,
  });
};

export const useUpdateQuantityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQuantityAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItemAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};