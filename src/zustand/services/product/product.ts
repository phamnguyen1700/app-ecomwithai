import { IProductResponse } from "@/types/product";
import { get } from "@/util/Http";

export const getAllProducts = async (filters = {}) => {
    const search = JSON.stringify(filters);
    const res = await get<IProductResponse>("product", {
        params:  search ,
    });
    return res;
};
