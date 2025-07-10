export type PaymentMethod = "Stripe" | "COD" | "Banking" | string;
export type OrderStatus =
    | "Pending"
    | "Cancelled"
    | "Shipped"
    | "Delivered"
    | string;
export type PaymentStatus = "Paid" | "Unpaid" | "Failed" | string;

export interface IOrderItem {
    skuId: string;
    productId: string;
    skuName: string;
    quantity: number;
    priceSnapshot: number;
    discountSnapshot: number;
    stockSnapshot: number;
    image?: string;
}

export interface IOrder {
    _id: string;
    userId: string;
    addressId: string;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    isPaid: boolean;
    paidAt: string; // ISO string
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    isRefunded: boolean;
    items: IOrderItem[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IOrderResponse {
    data: IOrder[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface OrderDetail {
    _id: string;
    userId: string;
    addressId: string;
    items: IOrderItem[];
    totalAmount: number;
    paymentMethod: string;
    isPaid: boolean;
    paidAt: string;
    orderStatus: string;
    paymentStatus: string;
    isRefunded: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OrderStatusCount {
    _id: string;
    count: number;
}

export interface MonthlySales {
    _id: number;
    totalSales: number;
    count: number;
}

export interface OrderAnalytics {
    totalOrders: number;
    totalRevenue: number;
    orderByStatus: OrderStatusCount[];
    monthlySales: MonthlySales[];
}
export interface IOrderDetailDialogProps {
    order: IOrder | null;
    isOpen: boolean;
    onClose: () => void;
}
