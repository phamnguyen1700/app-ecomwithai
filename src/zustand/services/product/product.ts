import { IProductDetail, IProductResponse } from "@/types/product";
import { get } from "@/util/Http";

export const getAllProducts = async (filters = {}) => {
    const search = JSON.stringify(filters);
    const res = await get<IProductResponse>("product", {
        params:  search ,
    });
    return res;
};
export const getProductDetail = async (id: string) => {
    const res = await get<IProductDetail>(`/product/${id}`);
    return res.data;
  };
