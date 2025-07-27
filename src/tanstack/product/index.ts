import { keepPreviousData, useQuery, useMutation } from "@tanstack/react-query";
import {
    getAllProducts,
    getProductDetail,
    uploadSkuImages,
    deletedSkuImages,
    updateSku,
    updateProduct,
    createProduct,
    createProductSku,
    deleteProductSku,
} from "@/zustand/services/product/product";
import { toast } from "react-toastify";
import { queryClient } from "@/lib/queryClient";
import {
    IProductUpdatePayload,
    ISku,
    ISkuUpdatePayload,
    IProductCreatePayload,
    IProductCreateSkuPayload,
    IProductResponse,
} from "@//types/product";

export const useProducts = (params: Record<string, any> = {}) => {
    return useQuery<IProductResponse>({
        queryKey: ["product", params],
        queryFn: () => getAllProducts(params),
        placeholderData: keepPreviousData,
    });
};
export const useProductDetail = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductDetail(id),
        enabled: !!id,
    });
};

export const useUploadSkuImages = () => {
    return useMutation<ISku, Error, { skuId: string; files: File[] }>({
        mutationFn: async ({ skuId, files }) => {
            const result = await uploadSkuImages(skuId, files);
            return result as ISku;
        },
        onSuccess: (data, variables) => {
            toast.success("Thêm ảnh thành công");
            queryClient.invalidateQueries({
                queryKey: ["sku", variables.skuId],
            });
        },
    });
};

// export const useReplaceSkuImage = () => {
//     return useMutation({
//         mutationFn: ({ skuId, imageIndex, file }: { skuId: string; imageIndex: number; file: File }) => replaceSkuImage(skuId, imageIndex, file),
//     });
// };

export const useDeletedSkuImages = () => {
    return useMutation<ISku, Error, { skuId: string; imageIndex: number }>({
        mutationFn: async ({ skuId, imageIndex }) => {
            const result = await deletedSkuImages(skuId, imageIndex);
            return result as ISku;
        },
        onSuccess: (data, variables) => {
            toast.success("Xóa ảnh thành công");
            queryClient.invalidateQueries({
                queryKey: ["sku", variables.skuId],
            });
        },
    });
};

export const useUpdateProductMutation = () => {
    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: IProductUpdatePayload;
        }) => updateProduct(id, payload),
        onSuccess: (_, variables) => {
            toast.success("Cập nhật sản phẩm thành công");
            queryClient.invalidateQueries({
                queryKey: ["product", variables.id],
            });
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
        onError: () => {
            toast.error("Cập nhật sản phẩm thất bại");
        },
    });
};

export const useUpdateSkuMutation = () => {
    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: ISkuUpdatePayload;
        }) => updateSku(id, payload),
        onSuccess: (_, variables) => {
            toast.success("Cập nhật SKU thành công");
            queryClient.invalidateQueries({ queryKey: ["sku", variables.id] });
        },
        onError: () => {
            toast.error("Cập nhật SKU thất bại");
        },
    });
};

export const useCreateProductMutation = () => {
    return useMutation({
        mutationFn: (payload: IProductCreatePayload) => createProduct(payload),
        onSuccess: () => {
            toast.success("Tạo sản phẩm thành công");
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
        onError: () => {
            toast.error("Tạo sản phẩm thất bại");
        },
    });
};

export const useCreateProductSkuMutation = () => {
    return useMutation({
        mutationFn: (payload: IProductCreateSkuPayload) =>
            createProductSku(payload),
        onSuccess: () => {
            toast.success("Tạo SKU thành công");
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
        onError: () => {
            toast.error("Tạo SKU thất bại");
        },
    });
};

export const useDeleteProductSkuMutation = () => {
    return useMutation({
        mutationFn: (skuId: string) => deleteProductSku(skuId),
        onSuccess: () => {
            toast.success("Xóa SKU thành công");
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
        onError: () => {
            toast.error("Xóa SKU thất bại");
        },
    });
};

export const useGetProductDetailMutation = () => {
    return useMutation({
        mutationFn: (id: string) => getProductDetail(id),
    });
};
