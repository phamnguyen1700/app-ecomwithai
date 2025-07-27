export interface ShippingAddress {
    _id: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

export interface Delivery {
    _id: string;
    orderId: string;
    customerId: string;
    shippingAddress: ShippingAddress;
    deliveryFee: number;
    deliveryPersonnelId: string;
    status:
    | "pending"
    | "processing"
    | "assigned"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "failed";
    trackingNumber: string;
    requiresSignature: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface DeliveryListResponse {
    data: Delivery[];
    total: number;
    page: number;
    limit: number;
}
export interface DeliveryDetail {
    _id: string;
    shippingAddress: ShippingAddress;
    trackingNumber: string;
    requiresSignature: boolean;
    status: string;
}


export interface ICreateDelivery {
    orderId: string;
    customerId: string;
    shippingAddress: {
        fullName: string;
        phone: string;
        street: string;
        city: string;
        country: string;
        postalCode: string;
    };
    deliveryFee: number;
    trackingNumber: string;
    estimatedDeliveryDate: string;
    requiresSignature: boolean;
}

// Delivery personnel interface
export interface IDeliveryPersonnel {
    _id: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    coupons: any[];
    deviceTokens: any[];
    emailVerifiedAt: string;
    isBanned: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    points: number;
    wishlist: any[];
}

// Delivery personnel response interface
export interface IDeliveryPersonnelResponse {
    data: IDeliveryPersonnel[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}