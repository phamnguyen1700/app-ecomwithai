import { get, post } from "@/util/Http";
import { AddressResponse } from "@/types/address";

export const getAddressAPI = async () => {
    const res = await get<AddressResponse>("/address");
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