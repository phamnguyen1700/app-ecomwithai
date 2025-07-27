import { get } from "@/util/Http";
import { IOrderResponse, OrderDetail } from "@/types/order";
import { put } from "@/util/Http";
import { IOrder } from "@/types/order";

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
export const getMyOrders = async (): Promise<IOrder[]> => {
    const res = await get<{ data: IOrder[] }>("/order/me/all");
    return res.data.data;
};

// Hủy đơn
export const cancelOrder = async (orderId: string): Promise<void> => {
    await put<void>(`/order/${orderId}/cancel`);
};
// Cập nhật trạng thái đơn (nếu cần)
export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<void> => {
  await put<void>(`/order/${orderId}/status`, { orderStatus: status });
};
