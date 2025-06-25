import { get, post } from "@/util/Http";

export const getAddressAPI = () => {
    return get("/address");
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