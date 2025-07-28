import { ICreateReview, ReviewListResponse, ReviewResponse } from "@/types/review";
import { get, post, remove } from "@/util/Http";

export const getAllReviewReported = async () => {
    const res = await get<any>("review/reported");
    return res.data;
};

export const getAllReview = async () => {
    const res = await get<ReviewListResponse>("/review")
    return res.data;
};

export const createReview = async (data: ICreateReview) => {
    const res = await post<ReviewResponse>("/review", data);
    return res.data;
};

export const softDeleted = async (id: string) => {
    return await remove(`/review/${id}`);
};

export const deleteReviewByAdmin = async (id: string) => {
    return await remove(`/review/admin/${id}`);
};