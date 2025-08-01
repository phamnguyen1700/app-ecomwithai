import { post } from "@/util/Http";
import { ICheckoutResponse } from "@/types/checkout";

export const checkout = (addressId: string) => {
    return post<ICheckoutResponse>("/checkout", { addressId });
}