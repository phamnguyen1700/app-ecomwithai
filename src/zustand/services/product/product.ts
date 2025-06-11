import { IProduct, IProductDetail } from "@/types/product";
import { get } from "@/util/Http";

export const getAllProducts = async () => {
    const res = await get<{ data: IProduct[] }>("/product");
    return res.data; // lấy đúng mảng
  };
export const getProductDetail = async (id: string) => {
    const res = await get<IProductDetail>(`/product/${id}`);
    return res.data; // lấy đúng mảng
  };