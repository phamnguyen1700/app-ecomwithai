export interface IDimensions {
    length: number;
    width: number;
    height: number;
}

export interface ISku {
    _id: string;
    productId: string;
    variantName: string;
    price: number;
    stock: number;
    reservedStock: number;
    batchCode: string;
    manufacturedAt: string;
    expiredAt: string;
    shelfLifeMonths: number;
    formulationType: string;
    returnable: boolean;
    returnCount: number;
    status: string;
    discount: number;
    image: string;
    weight: number;
    dimensions: IDimensions;
    internalNotes: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IProduct {
    _id: string;
    name: string;
    brand: string;
    description: string;
    ingredients: string[];
    skinConcerns: string[];
    suitableForSkinTypes: string[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    price?: number;
    image?: any;
    rating?: number;
    updatedAt: string;
    __v: number;
    skus: ISku[];
}
export interface IProductResponse {
    data: {
        data: IProduct[];
        metadata: {
            totalItems?: number;
            totalPages?: number;
            currentPage?: number;
            limit?: number;
        };
    };
}
export interface ProductCardTypes {
    items: any[];
    fields: any;
    loading: boolean;
    col: number;
}
