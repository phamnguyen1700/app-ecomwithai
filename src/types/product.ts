export interface IProduct {
    _id?: string;
    code: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
    image: string;
    category: string;
    rating: number; 
    skus: ISku[];
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
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    internalNotes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface IProductDetail {
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
    updatedAt: string;
    skus: ISku[]; // Multiple SKUs for the product
    image: string; // Main image URL
    rating?: number; // Optional, if the product has a rating
    vendor?: string; // Vendor name for the product (optional)
    oldPrice?: number; // Optional, if there's an old price (for discount calculation)
    availability?: string; // Optional, status like "In Stock", "Out of Stock", etc.
    size?: string; // Optional, size of the product (e.g. 100ml, 50g)
  }
  