import {
    addAddressAPI,
    getAddressAPI,
    getAllAddress,
    setDefaultAddressAPI,
}
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

export const useAddressesQuery = () => {
    return useQuery({
        queryKey: ['addresses'],
        queryFn: () => getAllAddress(),
    });
};
