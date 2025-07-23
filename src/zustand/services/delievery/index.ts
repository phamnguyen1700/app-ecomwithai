import { ICreateDelivery, IDeliveryPersonnelResponse } from "@/types/delievery";
import { get, patch, post } from "@/util/Http";

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

export const createDelivery = async (data: ICreateDelivery) => {
    const res = await post("delivery", data);
    return res.data;
  };
  
  
// Get all delivery personnel (admin only)
export const getDeliveryPersonnel = async (params?: {
    page?: number;
    limit?: number;
    email?: string;
    name?: string;
    phone?: string;
  }): Promise<IDeliveryPersonnelResponse> => {
    const res = await get("delivery/admin/delivery-personnel", { params });
    return res.data as IDeliveryPersonnelResponse;
  };

  export const assignDeliveryPersonnel = async (deliveryId: string, deliveryPersonnelId: string) => {
    const res = await patch(`delivery/${deliveryId}/assign`, { deliveryPersonnelId });
    return res.data;
  };
  