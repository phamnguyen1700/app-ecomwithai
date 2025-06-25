import { useQuery } from "@tanstack/react-query";
import { getAllUser } from "@/zustand/services/user";

export const useAllUser = (params: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["allUser", params],
        queryFn: () => getAllUser(params),
    });
};
