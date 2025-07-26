import { get, remove } from "@/util/Http";

export const getAllReviewReported = async () => {
    const res = await get<any>("review/reported");
    return res.data;
};

export const deleteReviewByAdmin = async (id: string) => {
    return await remove(`/review/admin/${id}`);
  };