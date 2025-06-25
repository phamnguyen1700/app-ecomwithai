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
  if (!order) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm text-muted-foreground px-1">
          <div><b>Mã đơn hàng:</b> {order._id}</div>
          <div><b>Khách hàng:</b> {usersData.find((user: User) => user._id === order.userId)?.email || "Không có"}</div>
          <div><b>Phương thức thanh toán:</b> {order.paymentMethod}</div>
          <div><b>Trạng thái đơn:</b> {order.orderStatus}</div>
          <div><b>Thanh toán:</b> {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</div>
          <div><b>Ngày thanh toán:</b> {order.paidAt ? formatDateToDisplay(order.paidAt) : "—"}</div>
          <div><b>Tổng tiền:</b> {formatMoney(order.totalAmount)}</div>
          <div><b>Ngày tạo:</b> {formatDateToDisplay(order.createdAt)}</div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p><b>Sản phẩm:</b> Hiện chưa hiển thị chi tiết `items[]` — có thể thêm sau nếu cần.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
