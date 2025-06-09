export interface IProductSKU {
  _id: string;
  productId: string;
  variantName: string;
  price: number;
  stock: number;
  reservedStock: number;
  batchCode?: string;
  manufacturedAt?: string;
  expiredAt?: string;
  shelfLifeMonths?: number;
  formulationType: string;
  returnable: boolean;
  returnCount: number;
  status: string;
  discount: number;
  image?: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}



export interface IProduct {
  _id?: string;
  code: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  image: string;
  ingredients: string[];
  rating: number;
  skus: IProductSKU[];
  brand: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  suitableForSkinTypes: string[];
  skinConcerns: string[];
}
