import { get } from "@/util/Http";

export const getAllDelivery = async ({
    page = 1,
    limit = 10,
    search = "",
    status,
}: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    const res = await get("/delivery", {
        params: {
            page,
            limit,
            ...(search ? { search } : {}),
            ...(status && status !== "all" ? { status } : {}),
        },
    });
    return res.data;
};

export const getDeliveryDetail = async (id: string) => {
    const res = await get(`/delivery/${id}`);
    return res.data;
};
