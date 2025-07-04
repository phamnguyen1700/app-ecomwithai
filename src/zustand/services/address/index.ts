import { get, post } from "@/util/Http";
import { IAddress } from "@/types/address";

export const getAddressAPI = async () => {
    const res = await get<IAddress[]>("/address");
    return res.data;
};

export const addAddressAPI = (data: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
}) => {
    return post("/address", data);
};