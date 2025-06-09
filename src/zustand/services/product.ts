import { get } from "@/util/Http";
import { IProduct } from "@/types/product";

export const getAllProducts = async (page = 1, limit = 10, search = "") => {
  const query = `product?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`;
  return await get<{ data: IProduct[]; meta: any }>(query);
};
