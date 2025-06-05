import { IProduct } from "@/types/product";
import { get } from "@/util/Http";

export const getAllProducts = async () => {
    return await get<IProduct[]>("");
};
