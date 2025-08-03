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
import { useAddressesQuery } from "@/tanstack/address";
import { useCreateDeliveryMutation } from "@/tanstack/delivery";
import { useUpdateOrderStatusMutation } from "@/tanstack/order";
import Image from "next/image";
import { useState } from "react";

interface OrderDetailDialogProps {
  usersData: User[];
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onDeliverySuccess?: () => void;
}

export default function OrderDetailDialog({
  usersData,
  order,
  isOpen,
  onClose,
  onDeliverySuccess,
}: OrderDetailDialogProps) {
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const products = productsData?.data || [];
  const items = order?.items || [];
  const user = usersData.find((user: User) => user._id === order?.userId);

  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState("10000");
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);
  const [confirmDeliveryVisible, setConfirmDeliveryVisible] = useState(false);

  const { data: addressData = [] } = useAddressesQuery();
  const createDeliveryMutation = useCreateDeliveryMutation();
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();

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
                  <tr key={`${item.skuId}-${idx}`}>
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
        <div className="flex justify-end text-base font-semibold">
          <span>Tổng tiền:&nbsp;</span>
          <span className="text-green-600">{formatMoney(order.totalAmount)}</span>
        </div>

        {/* Nút giao đơn và hủy đơn */}
        {(order.orderStatus === "Shipped") ? (
          <div className="flex justify-center gap-4 mt-[-40px]">
            <span className="text-base font-semibold text-blue-700">
              Đơn hàng đang được giao
            </span>
          </div>
        ) : (order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled") ? (
          <div className="flex justify-center gap-4 mt-[-40px]">
            <button
              onClick={() => setDeliveryModalVisible(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              Giao đơn
            </button>
            <button
              onClick={() => setConfirmCancelVisible(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
            >
              Hủy đơn
            </button>
          </div>
        ) : null}

        {/* Modal tạo đơn giao hàng */}
        {deliveryModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-8 min-w-[320px] shadow-lg">
              <div className="font-bold text-lg mb-4">Tạo đơn giao hàng</div>
              <div className="mb-3">Phí giao hàng (VNĐ):</div>
              <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                value={deliveryFee}
                onChange={e => setDeliveryFee(e.target.value)}
                placeholder="Nhập phí giao hàng"
              />
              <div className="flex gap-2 justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setConfirmDeliveryVisible(true)}
                >
                  Xác nhận giao đơn
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={() => setDeliveryModalVisible(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận giao đơn */}
        {confirmDeliveryVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-8 min-w-[320px] shadow-lg">
              <div className="font-bold text-lg mb-4">Xác nhận giao đơn hàng?</div>
              <div className="mb-4">Bạn có chắc chắn muốn giao đơn hàng này không?</div>
              <div className="flex gap-2 justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={async () => {
                    if (!order) return;
                    const address = addressData.find((a: any) => a._id === order.addressId);
                    if (!address) {
                      alert("Không tìm thấy địa chỉ giao hàng cho đơn này!");
                      return;
                    }
                    const shippingAddress = {
                      fullName: address.fullName,
                      phone: address.phone,
                      street: address.street,
                      city: address.city,
                      country: address.country,
                      postalCode: address.postalCode,
                    };
                    const deliveryData = {
                      orderId: order._id,
                      customerId: order.userId,
                      deliveryFee: parseInt(deliveryFee),
                      shippingAddress: shippingAddress,
                      trackingNumber: `VN${Math.floor(100000000 + Math.random() * 900000000)}`,
                      estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
                      requiresSignature: false,
                    };
                    console.log('=== CREATE DELIVERY DATA ===');
                    console.log('Delivery Data:', deliveryData);
                    console.log('Address Data:', address);
                    console.log('Order Data:', order);
                    
                    createDeliveryMutation.mutate(deliveryData, {
                      onSuccess: async () => {
                        console.log('=== UPDATE ORDER STATUS DATA ===');
                        console.log('Update Order Status Data:', { orderId: order._id, orderStatus: 'Shipped' });
                        
                        await updateOrderStatusMutation.mutate({ orderId: order._id, orderStatus: 'Shipped' }, {
                          onSuccess: () => {
                            console.log('=== SUCCESS ===');
                            console.log('Delivery created successfully');
                            console.log('Order status updated successfully');
                            setConfirmDeliveryVisible(false);
                            setDeliveryModalVisible(false);
                            onClose();
                            if (typeof onDeliverySuccess === 'function') onDeliverySuccess();
                          }
                        });
                      }
                    });
                  }}
                  disabled={createDeliveryMutation.isPending}
                >
                  {createDeliveryMutation.isPending ? "Đang tạo..." : "Xác nhận"}
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={() => setConfirmDeliveryVisible(false)}
                  disabled={createDeliveryMutation.isPending}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận hủy đơn */}
        {confirmCancelVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-8 min-w-[320px] shadow-lg">
              <div className="font-bold text-lg mb-4">Xác nhận hủy đơn hàng?</div>
              <div className="mb-4">Bạn có chắc chắn muốn hủy đơn hàng này không?</div>
              <div className="flex gap-2 justify-end">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    if (!order) return;
                    console.log('=== CANCEL ORDER DATA ===');
                    console.log('Cancel Order Data:', { orderId: order._id, orderStatus: 'Cancelled' });
                    console.log('Order Data:', order);
                    
                    updateOrderStatusMutation.mutate({ orderId: order._id, orderStatus: 'Cancelled' }, {
                      onSuccess: () => {
                        console.log('=== CANCEL SUCCESS ===');
                        console.log('Order cancelled successfully');
                        setConfirmCancelVisible(false);
                        onClose();
                        if (typeof onDeliverySuccess === 'function') onDeliverySuccess();
                      }
                    });
                  }}
                  disabled={updateOrderStatusMutation.isPending}
                >
                  {updateOrderStatusMutation.isPending ? "Đang hủy..." : "Xác nhận"}
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={() => setConfirmCancelVisible(false)}
                  disabled={updateOrderStatusMutation.isPending}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
