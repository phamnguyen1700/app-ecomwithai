import { ISku } from "./product";

export interface IOrder {
    _id: string;
    userId: string;
    addressId: string;
    totalAmount: number;
    paymentMethod: "Stripe" | "COD" | string;
    isPaid: boolean;
    paidAt: string; // ISO string
    orderStatus: "Pending" | "Cancelled" | "Shipped" | "Delivered" | string;
    paymentStatus: "Paid" | "Unpaid" | "Failed" | string;
    isRefunded: boolean;
    items: ISku[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IOrderResponse {
    data: IOrder[];
    metadata: {
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
        limit?: number;
    };
}
