import { get, patch, post } from "@/util/Http";
import { deleteReviewByAdmin } from "@/zustand/services/review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useReviewAdminQuery = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    return useQuery<any>({
        queryKey: ["review/reported", page, limit],
        queryFn: () => get<any>(`/review/reported?page=${page}&limit=${limit}`),
    });
};
export const useDeleteReviewAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteReviewByAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review/reported"] });
        },
    });
};

export const useReviewList = (filters?: any) => {
    return useQuery<any>({
        queryKey: ["review", filters],
        queryFn: async () => {
            const res = await get("/review", {
                params: filters ?? {},
            });
            return res.data;
        },
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => post("/review", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: { rating?: number; comment?: string; images?: string[] };
        }) => patch(`/review/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
    });
};

export const useReportReview = () =>
    useMutation({
        mutationFn: async ({
            id,
            reasons,
        }: {
            id: string;
            reasons: string[];
        }) => {
            const res = await post(`/review/${id}/report`, { reasons });
            return res.data;
        },
    });
