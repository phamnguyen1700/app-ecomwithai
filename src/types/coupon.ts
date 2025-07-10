export interface Coupon {
    _id: string;
    code: string;
    email?: string;
    value: number;
    isUsed: boolean;
    createdAt: string;
}

export interface CouponResponse {
    data: Coupon[];
    total: number;
}
