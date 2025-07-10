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
