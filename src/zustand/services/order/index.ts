import { get } from "@/util/Http";
import { IOrderResponse } from "@/types/order";

export const getAllOrder = async (filter = {}) => {
    const res = await get<IOrderResponse>("/order/admin", {
        params: filter,
    });
    return res.data;
};

export const getOrderDetail = (id: string) => get(`/order/${id}`);