export interface IReview {
  _id: string;
  deliveryId: string;
  orderId: string;
  productId: string;
  userId: {
    _id: string;
    email: string;
  };
  rating: number;
  comment: string;
  images: string[];
  reported: boolean;
  reportReasons: string[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICreateReview {
  deliveryId: string;
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
  images?: string[];
  deleted?: boolean;
}

export interface ReviewResponse {
  success: boolean;
  data: IReview;
  message: string;
}

export interface ReviewListResponse {
  success: boolean;
  data: IReview[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

export interface ReviewListGetState {
    userId?: string;
    deliveryId?: string;
    productId?: string;
}