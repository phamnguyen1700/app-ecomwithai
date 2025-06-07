export const formatMoney = (value: number | undefined | null) =>
  (value ?? 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
