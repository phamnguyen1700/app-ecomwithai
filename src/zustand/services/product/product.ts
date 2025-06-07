import { IProductResponse } from "@/types/product";
import { get } from "@/util/Http";

export const getAllProducts = async () => {
    const res = await get<IProductResponse>("product");
    return res;
};
