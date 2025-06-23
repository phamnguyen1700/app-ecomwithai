import { post } from "@/util/Http";

export const addToCartAPI = (data: {
    skuId?: string;
    productId?: string;
    skuName?: string;
    image?: string;
    quantity?: number;
    selected?: boolean;
    addedAt?: string;
    priceSnapshot?: number;
    discountSnapshot?: number;
    stockSnapshot?: number;
}) => {
    return post("/cart/item", data);
};
