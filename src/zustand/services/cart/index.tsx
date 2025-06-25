import { get, post, patch, remove } from "@/util/Http";

export const getCartAPI = () => {
    const data = get("/cart");
    return data;
};

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

export const updateQuantityAPI = (data: {
    skuId?: string;
    productId?: string;
    quantity?: number;
}) => {
    return patch("/cart/item/quantity", data);
};

export const removeCartItemAPI = (data: {
    skuId?: string;
    productId?: string;
}) => {
    return remove("/cart/item", { data });
};

export const selectCartAPI = (data: {
    skuId?: string;
    productId?: string;
    selected?: boolean;
}) => {
    return patch("/cart/item/select", data);
};