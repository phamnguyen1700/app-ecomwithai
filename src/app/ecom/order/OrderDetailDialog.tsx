"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IOrderDetailDialogProps } from "@/types/order";
import { formatMoney } from "@/hooks/formatMoney";
import { formatDateToDisplay } from "@/hooks/formatDateToDisplay";
export default function OrderDetailDialog({
  order,
  isOpen,
  onClose,
}: IOrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle asChild>
            <div className="text-lg font-bold">Chi tiết đơn hàng</div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex p-2 gap-6">
          {/* LEFT: Thông tin đơn hàng */}
          <div className="w-1/2 border-r border-gray-300 pr-4 space-y-3">
            <div>
              <Label>Mã đơn</Label>
              <Input disabled defaultValue={order._id} />
            </div>
            <div>
              <Label>Phương thức thanh toán</Label>
              <Input disabled defaultValue={order.paymentMethod} />
            </div>
            <div>
              <Label>Trạng thái thanh toán</Label>
              <Input disabled defaultValue={order.paymentStatus} />
            </div>
            <div>
              <Label>Đã thanh toán lúc</Label>
              <Input disabled defaultValue={formatDateToDisplay(order.paidAt)} />
            </div>
            <div>
              <Label>Tổng tiền</Label>
              <Input disabled defaultValue={formatMoney(order.totalAmount)} />
            </div>
            <div>
              <Label>Trạng thái đơn hàng</Label>
              <Input disabled defaultValue={order.orderStatus} />
            </div>
            <div>
              <Label>Ngày tạo</Label>
              <Input disabled defaultValue={formatDateToDisplay(order.createdAt)} />
            </div>
          </div>

          {/* RIGHT: Danh sách sản phẩm */}
          <div className="w-1/2 space-y-2">
            <div className="font-semibold">Danh sách sản phẩm</div>
            <div className="max-h-[420px] overflow-y-auto space-y-2 super-thin-scrollbar">
              {order.items?.map((item, index) => (
                <div
                  key={item.skuId || index}
                  className="p-3 border border-gray-300 rounded bg-white space-y-2"
                >
                  <div>
                    <Label>Mã sản phẩm</Label>
                    <Input disabled defaultValue={item.skuId} />
                  </div>
                  <div>
                    <Label>Phiên bản</Label>
                    <Input disabled defaultValue={item.skuName} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Giá</Label>
                      <Input disabled defaultValue={formatMoney(item.priceSnapshot)} />
                    </div>
                    <div>
                      <Label>Giảm giá (%)</Label>
                      <Input disabled defaultValue={item.discountSnapshot + " %"} />
                    </div>
                    <div>
                      <Label>Tồn kho tại thời điểm đặt</Label>
                      <Input disabled defaultValue={item.stockSnapshot} />
                    </div>
                    <div>
                      <Label>Số lượng</Label>
                      <Input disabled defaultValue={item.quantity} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
