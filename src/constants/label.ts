export const ORDER_STATUS_LABELS: Record<string, string> = {
  Pending: "Đang xử lý",
  Cancelled: "Đã hủy",
  Shipped: "Đã gửi hàng",
  Delivered: "Đã giao",
  // ... thêm nếu có trạng thái khác
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  Paid: "Đã thanh toán",
  Unpaid: "Chưa thanh toán",
  Failed: "Thanh toán thất bại",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  Stripe: "Thanh toán online",
  COD: "Thanh toán khi nhận hàng",
  Banking: "Chuyển khoản",
  // ... thêm nếu có
};
