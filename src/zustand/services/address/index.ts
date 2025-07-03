import { get, post } from "@/util/Http";
import { IAddress } from "@/types/address";

export const getAddressAPI = async () => {
    const res = await get<IAddress[]>("/address");
    return res.data;
};

export const addAddressAPI = async (data: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
  }): Promise<IAddress> => {
    const res = await post<IAddress>("/address", data);
    return res.data; // ✅ trả ra đúng kiểu
  };

export const setDefaultAddressAPI = (id: string) => {
    return post(`/address/${id}/set-default`);
  };