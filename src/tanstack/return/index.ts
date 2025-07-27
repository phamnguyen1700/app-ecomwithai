import { get, patch } from "@/util/Http";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useReturnAdminAllQuery = ({ page = 1, limit = 10 }) => {
    return useQuery<any>({
        queryKey: ["return-admin-all", page, limit],
        queryFn: async () => {
            const res = await get("/return/admin/all", {
                params: { page, limit },
            });
            return res.data;
        },
    });
};

export const useApproveReturn = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await patch(`/return/approve/${id}`);
            return res.data;
        },
    });
};

export const useRejectReturn = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await patch(`/return/reject/${id}`);
            return res.data;
        },
    });
};
