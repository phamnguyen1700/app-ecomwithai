
export interface IOrderItem {
    skuId: string;
    skuName: string;
    image: string;
    priceSnapshot: number;
    discountSnapshot: number;
    stockSnapshot: number;
    quantity: number;
  }
  
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
    items: IOrderItem[];
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
export interface IOrderDetailDialogProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
}