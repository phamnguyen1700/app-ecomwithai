import { post } from "@/util/Http";

export const checkout = (addressId: string) => {
    return post("/checkout", { addressId });
}