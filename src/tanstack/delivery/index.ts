import { DeliveryDetail, DeliveryListResponse, ICreateDelivery } from "@/types/delievery";
import { get } from "@/util/Http";
import { assignDeliveryPersonnel, createDelivery, getDeliveryPersonnel } from "@/zustand/services/delievery";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
export const useDeliveries = (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    return useQuery<DeliveryListResponse>({
        queryKey: ["deliveries", params],
        queryFn: async () => {
            const res = await get<DeliveryListResponse>("/delivery", {
                params,
            });
            return res.data;
        },
    });
};

export const useDeliveryDetail = (id?: string) =>
    useQuery<DeliveryDetail>({
        queryKey: ["delivery-detail", id],
        queryFn: async () => {
            const res = await get<DeliveryDetail>(`/delivery/${id}`);
            return res.data;
        },
        enabled: !!id,
    });


export const useCreateDeliveryMutation = () => {
    return useMutation({
        mutationFn: async (data: ICreateDelivery) => {
            return await createDelivery(data);
        },
        onSuccess: () => {
            toast.success("Tạo giao hàng thành công");
        },
        onError: (error: any) => {
            toast.error(error.message || "Lỗi tạo đơn giao hàng");
        }
    });
};


export const useDeliveryPersonnelQuery = (params?: {
    page?: number;
    limit?: number;
    email?: string;
    name?: string;
    phone?: string;
}) => {
    return useQuery({
        queryKey: ['delivery-personnel', params],
        queryFn: async () => {
            return await getDeliveryPersonnel(params);
        },
    });
};



export const useAssignDeliveryPersonnelMutation = () => {
    return useMutation({
        mutationFn: async ({ deliveryId, deliveryPersonnelId }: { deliveryId: string, deliveryPersonnelId: string }) => {
            return await assignDeliveryPersonnel(deliveryId, deliveryPersonnelId);
        },
        onSuccess: () => {
            toast.success("Phân công thành công");
        },
        onError: (err: any) => {
            toast.error(err.message || "Lỗi phân công");
        }
    });
}