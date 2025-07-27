import { IOrderResponse, OrderAnalytics, OrderDetail } from "@/types/order";
import { get } from "@/util/Http";
import {
    cancelOrder,
    getOrderDetail,
    updateOrderStatus,
} from "@/zustand/services/order";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
export const useAllOrderUser = ({
    page = 1,
    limit = 10,
    status,
    email,
}: any) => {
    return useQuery<any>({
        queryKey: ["orders", page, limit, status, email],
        queryFn: async () => {
            const res = await get("/order/me/all", {
                params: {
                    page,
                    limit,
                    status,
                    email,
                },
            });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};
export const useAllOrder = (params: Record<string, any> = {}) => {
    const { email, status, page = 1, limit = 10 } = params;

    const queryParams = {
        email,
        page,
        limit,
        ...(status && status !== "all" ? { status } : {}),
    };

    return useQuery<IOrderResponse>({
        queryKey: ["order-admin", queryParams],
        queryFn: async () => {
            const res = await get<IOrderResponse>("/order/admin", {
                params: queryParams,
            });
            return res.data;
        },
    });
};

export const useOrderDetail = (id?: string) =>
    useQuery<OrderDetail>({
        queryKey: ["order-detail", id],
        queryFn: () => getOrderDetail(id!),
        enabled: !!id,
    });

export const useAnalytics = () => {
    return useQuery<OrderAnalytics>({
        queryKey: ["order-analytics"],
        queryFn: async () => {
            const res = await get<OrderAnalytics>("/order/admin/analytics");
            return res.data;
        },
    });
};

export const useUpdateOrderStatusMutation = () => {
    return useMutation({
        mutationFn: async ({
            orderId,
            orderStatus,
        }: {
            orderId: string;
            orderStatus: string;
        }) => {
            return await updateOrderStatus(orderId, orderStatus);
        },
        onSuccess: (_data, variables) => {
            if (variables.orderStatus === "Cancelled") {
                toast.success("Đơn hàng đã bị hủy");
            } else {
                toast.success("Cập nhật trạng thái đơn hàng thành công");
            }
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

export const useCancelOrderMutation = () => {
    return useMutation({
        mutationFn: async ({ orderId }: { orderId: string }) => {
            return await cancelOrder(orderId);
        },
        onSuccess: () => {
            toast.success("Hủy đơn hàng thành công");
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};
