import { get, put } from "@/util/Http";
import { IOrderResponse,IOrder } from "@/types/order";

export const getAllOrder = async (filter = {}) => {
    const res = await get<IOrderResponse>("/order/admin", {
        params: filter,
    });
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
    await get<void>(`/order/${orderId}/status`, {
      method: "PUT",
      data: { status },
    });
  };