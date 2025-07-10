import { get } from "@/util/Http";
import { IOrderResponse, OrderDetail } from "@/types/order";

export const getAllOrder = async (filter = {}) => {
    const res = await get<IOrderResponse>("/order/admin", {
        params: filter,
    });
    return res.data;
};
export const getOrderDetail = async (id: string): Promise<OrderDetail> => {
    const res = await get<OrderDetail>(`/order/${id}`);
    return res.data;
};
