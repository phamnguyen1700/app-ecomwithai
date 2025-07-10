import { get } from "@/util/Http";
import { IOrderResponse } from "@/types/order";

export const getAllOrder = async (filter = {}) => {
    const res = await get<IOrderResponse>("/order/admin", {
        params: filter,
    });
    return res.data;
};

export const getOrderDetail = (id: string) => get(`/order/${id}`);

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
