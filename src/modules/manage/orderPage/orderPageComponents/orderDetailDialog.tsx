"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatMoney } from "@/hooks/formatMoney";
import { formatDateToDisplay } from "@/hooks/formatDateToDisplay";
import { IOrder } from "@/types/order";
import { User } from "@/types/user";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/constants/label";
import { useProducts } from "@/tanstack/product";
import Image from "next/image";

interface OrderDetailDialogProps {
  usersData: User[];
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailDialog({
  usersData,
  order,
  isOpen,
  onClose,
}: OrderDetailDialogProps) {
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const products = productsData?.data || [];
  const items = order?.items || [];
  const user = usersData.find((user: User) => user._id === order?.userId);

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex flex-col items-center justify-center gap-2 mb-2">
            <>
              THÔNG TIN ĐƠN HÀNG
            </>
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ml-2
                ${order.orderStatus === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.orderStatus === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : order.orderStatus === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.orderStatus === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                }
              `}
            >
              {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm px-1 mb-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[220px] space-y-1">
              <div><b>Mã đơn hàng:</b> {order._id}</div>
              <div><b>Khách hàng:</b> {user?.email || "Không có"}</div>
              <div>
                <b>Phương thức thanh toán:</b>{" "}
                {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
              </div>
            </div>
            <div className="flex-1 min-w-[220px] space-y-1">
              <div>
                <b>Thanh toán:</b>{" "}
                {order.isPaid
                  ? (PAYMENT_STATUS_LABELS["Paid"] || "Đã thanh toán")
                  : (PAYMENT_STATUS_LABELS["Unpaid"] || "Chưa thanh toán")}
              </div>
              <div><b>Ngày thanh toán:</b> {order.paidAt ? formatDateToDisplay(order.paidAt) : "—"}</div>
              <div><b>Ngày tạo:</b> {formatDateToDisplay(order.createdAt)}</div>
            </div>
          </div>
        </div>
        <div className="border rounded-md overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Sản phẩm</th>
                <th className="p-2 border">Hình</th>
                <th className="p-2 border">Số lượng</th>
                <th className="p-2 border">Giá</th>
                <th className="p-2 border">Giảm giá (%)</th>
                <th className="p-2 border">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map((item, idx) => {
                const price = item.priceSnapshot || 0;
                const discount = item.discountSnapshot || 0;
                const quantity = item.quantity || 0;
                const discountedPrice = price * (1 - discount / 100);
                const lineTotal = discountedPrice * quantity;

                // Tìm sản phẩm theo productId
                const product = products.find((p) => p._id === item.productId);
                const productName = product?.name || (isLoadingProducts ? "Đang tải..." : "Không tìm thấy");

                return (
                  <tr key={item.skuId}>
                    <td className="p-2 border text-center">{idx + 1}</td>
                    <td className="p-2 border">
                      <div>
                        <div className="font-medium">{productName}</div>
                        <div className="text-gray-500 text-xs">{item.skuName}</div>
                      </div>
                    </td>
                    <td className="p-2 border text-center">
                      {item.image ? (
                        <Image
                          src={item.image || ""}
                          alt={item.skuName}
                          width={48} 
                          height={48}
                          className="w-12 h-12 object-contain mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-2 border text-center">{quantity}</td>
                    <td className="p-2 border text-right">{formatMoney(price)}</td>
                    <td className="p-2 border text-center">{discount ? `${discount}%` : "—"}</td>
                    <td className="p-2 border text-right">{formatMoney(lineTotal)}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="p-2 border text-center text-gray-400">Không có sản phẩm nào trong đơn hàng</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4 text-base font-semibold">
          <span>Tổng tiền:&nbsp;</span>
          <span className="text-green-600">{formatMoney(order.totalAmount)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
