import {addAddressAPI,
        getAddressAPI,
        setDefaultAddressAPI,} 
        from "@/zustand/services/address";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAddressQuery = () => {
    return useQuery({
        queryKey: ["address"],
        queryFn: getAddressAPI,
    });
};

export const useAddAddressMutation = () => {
    return useMutation({
        mutationFn: addAddressAPI,
    });
};
export const useSetDefaultAddressMutation = () => {
    return useMutation({
      mutationFn: setDefaultAddressAPI,
    });
  };