import { IProductCreatePayload, IProductCreateSkuPayload, IProductDetail, IProductResponse, IProductUpdatePayload, ISkuUpdatePayload } from "@/types/product";
import { get, post, remove, patch } from "@/util/Http";

export const getAllProducts = async (filters = {}) => {
    const res = await get<IProductResponse>("product", {
        params: filters,
    });
    return res.data;
};

export const getProducts = async (filters = {}) => {
    const res = await get<IProductResponse>("product", {
        params: filters,
    });
    return res.data;
};

export const getReturnedSkus = async (filters = {}) => {
    const res = await get<IProductResponse>("product/returned-skus", {
        params: filters,
    });
    return res.data;
};
export const getProductDetail = async (id: string) => {
    const res = await get<IProductDetail>(`/product/${id}`);
    return res.data;
};

export const uploadSkuImages = async (skuId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });
    const res = await post(`/sku/${skuId}/images/add`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': "*/*"
        }
    });
    return res.data;
};

export const replaceSkuImage = async (skuId: string, imageIndex: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await post(`/sku/${skuId}/images/${imageIndex}`, formData, {
        method: 'PATCH',
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const deletedSkuImages = async (skuId: string, imageIndex: number) => {
    const res = await remove(`/sku/${skuId}/images/${imageIndex}`);
    return res.data;
};

export const updateProduct = async (id: string, payload: IProductUpdatePayload) => {
    const res = await patch(`/product/${id}`, payload);
    return res.data;
};

export const updateSku = async (skuId: string, payload: ISkuUpdatePayload) => {
    const res = await patch(`/sku/${skuId}`, payload);
    return res.data;
};

export const createProduct = async (payload: IProductCreatePayload) => {
    const res = await post(`/product`, payload);
    return res.data;
};

export const createProductSku = async (payload: IProductCreateSkuPayload) => {
    const res = await post(`/sku`, payload);
    return res.data;
};

export const deleteProductSku = async (skuId: string) => {
    const res = await remove(`/sku/${skuId}`);
    return res.data;
};