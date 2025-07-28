import { get, patch, post } from "@/util/Http";
import { deleteReviewByAdmin, getAllReview, createReview, softDeleted } from "@/zustand/services/review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICreateReview, IUpdateReview, ReviewResponse, ReviewListResponse } from "@/types/review";
import { toast } from "react-toastify";
export const useReviewAdminQuery = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    return useQuery<ReviewListResponse>({
        queryKey: ["review/reported", page, limit],
        queryFn: async () => {
            const res = await get<ReviewListResponse>(`/review/reported?page=${page}&limit=${limit}`);
            return res.data;
        },
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

export const useReviewList = () => {
    return useQuery<ReviewListResponse>({
        queryKey: ["review"],
        queryFn: async () => {
            const res = await getAllReview();
            return res;
        },
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ICreateReview) => {
            const res = await createReview(data);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
            toast.success("Đã gửi đánh giá!");
        },
        onError: (error) => {
            console.error("Review creation error:", error);
            toast.error("Có lỗi xảy ra khi gửi đánh giá!");
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
            data: IUpdateReview;
        }) => patch<ReviewResponse>(`/review/${id}`, data),
        onSuccess: () => {
            toast.success("Đã cập nhật đánh giá!");
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
        onError: (error) => {
            console.error("Review update error:", error);
            toast.error("Có lỗi xảy ra khi cập nhật đánh giá!");
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

export const useSoftDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => softDeleted(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
            toast.success("Đã xóa đánh giá thành công!");
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa đánh giá!");
        },
    });
};
