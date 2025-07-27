import { get } from "@/util/Http";
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
