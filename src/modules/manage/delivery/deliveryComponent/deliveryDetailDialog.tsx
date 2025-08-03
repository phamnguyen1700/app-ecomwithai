import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatDateToDisplay } from "@/hooks/formatDateToDisplay";
import { Delivery } from "@/types/delievery";
import React, { useState } from "react";
import { useAssignDeliveryPersonnelMutation } from "@/tanstack/delivery";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateOrderStatusMutation } from "@/tanstack/order";
import Image from "next/image";

const DELIVERY_STATUS_LABELS: Record<string, string> = {
    pending: "Đang chờ phân công",
    assigned: "Đã phân công",
    out_for_delivery: "Đang giao",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
    failed: "Thất bại",
};

interface DeliveryDetailDialogProps {
    delivery: Delivery | null;
    open: boolean;
    onClose: () => void;
    deliveryPersonnelData?: any[];
}

const DeliveryDetailDialog: React.FC<DeliveryDetailDialogProps> = ({ delivery, open, onClose, deliveryPersonnelData }) => {
    // Hooks luôn ở đầu component
    const personnel = deliveryPersonnelData?.find((p) => p._id === delivery?.deliveryPersonnelId);
    const personnelEmail = personnel?.email || delivery?.deliveryPersonnelId || "Không có";
    const isPending = delivery?.status === 'pending';
    const isAssigned = delivery?.status === 'assigned';
    const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
    const assignMutation = useAssignDeliveryPersonnelMutation();
    const queryClient = useQueryClient();
    const updateOrderStatusMutation = useUpdateOrderStatusMutation();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">Chi tiết giao hàng</DialogTitle>
                {!delivery ? (
                  <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <div className="text-gray-600">Đang tải...</div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-xl shadow p-6 mt-4 border border-gray-200">
                        <div className="text-lg font-bold text-center mb-2">Mã đơn hàng</div>
                        <div className="text-center font-mono mb-2">{delivery.orderId}</div>
                        <hr className="my-2" />
                        <div className="mb-1"><b>Khách hàng:</b> {delivery.shippingAddress.fullName}</div>
                        <div className="mb-1"><b>Số điện thoại:</b> {delivery.shippingAddress.phone}</div>
                        <div className="mb-1"><b>Địa chỉ:</b> {delivery.shippingAddress.street}, {delivery.shippingAddress.city}, {delivery.shippingAddress.country}</div>
                        <hr className="my-2" />
                        <div className="mb-1"><b>Ngày tạo:</b> {formatDateToDisplay(delivery.createdAt)}</div>
                        <div className="mb-1"><b>Tracking Number:</b> {delivery.trackingNumber}</div>
                        <div className="mb-1 flex items-center gap-2">
                            <b>Trạng thái:</b>
                            <span
                                className={
                                    `inline-block px-3 py-1 rounded-full text-xs font-bold
                                ${delivery.status === 'pending' ? 'bg-gray-200 text-gray-700'
                                    : delivery.status === 'assigned' ? 'bg-blue-100 text-blue-700'
                                    : delivery.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-700'
                                    : delivery.status === 'delivered' ? 'bg-green-100 text-green-700'
                                    : (delivery.status === 'failed' || delivery.status === 'cancelled') ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'}
                                `}
                            >
                                {DELIVERY_STATUS_LABELS[delivery.status] || delivery.status}
                            </span>
                        </div>
                    {delivery.status === 'failed' && (
                        <div className="my-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                            <div className="font-bold text-yellow-800 mb-1">Lý do giao hàng thất bại:</div>
                            <div className="text-yellow-900 text-sm">
                                {('failedReason' in delivery && (delivery as any).failedReason)
                                    ? (delivery as any).failedReason
                                    : 'Khách hàng không có mặt tại địa chỉ nhận hàng hoặc từ chối nhận hàng.'}
                            </div>
                        </div>
                    )}
                    <hr className="my-2" />
                    <div className="mb-1"><b>Nhân viên giao hàng:</b> {(isPending || isAssigned) ? <span className="text-gray-500">Không có</span> : <span className="text-blue-600 font-semibold">{personnelEmail}</span>}</div>
                    <div className="mb-1"><b>Ngày giao:</b> {'updatedAt' in delivery ? formatDateToDisplay(delivery.updatedAt) : '—'}</div>
                    <div className="mb-1"><b>Phí giao:</b> {delivery.deliveryFee?.toLocaleString('vi-VN')}₫</div>
                    <div className="mb-1"><b>Yêu cầu ký nhận:</b> {delivery.requiresSignature ? 'Có' : 'Không'}</div>
                  </div>
                {delivery.status === 'delivered' && 'proofOfDeliveryUrl' in delivery && (delivery as any).proofOfDeliveryUrl && (
                    <div className="flex flex-col items-center">
                        <div className="font-bold mb-2">Ảnh xác nhận giao hàng</div>
                        <Image
                            src={(delivery as any).proofOfDeliveryUrl}
                            alt="Ảnh xác nhận giao hàng"
                            width={320}
                            height={320}
                            className="rounded-lg border max-w-xs max-h-80 object-contain"
                        />
                    </div>
                )}
                {(isPending || isAssigned) && (
                    <div>
                        <div className="font-bold mb-2">Chọn nhân viên giao hàng</div>
                        <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                            {deliveryPersonnelData && deliveryPersonnelData.length > 0 ? deliveryPersonnelData.map((staff: any) => (
                                <div
                                    key={staff._id}
                                    className={`p-2 rounded cursor-pointer border ${selectedStaff?._id === staff._id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100 border-gray-200'}`}
                                    onClick={() => setSelectedStaff(staff)}
                                >
                                    <span className={`font-semibold ${selectedStaff?._id === staff._id ? 'text-blue-700' : ''}`}>{staff.email}</span>
                                </div>
                            )) : <div className="text-gray-500">Không có nhân viên giao hàng nào</div>}
                        </div>
                        <button
                            className={`w-full font-bold py-3 rounded-xl text-lg transition ${
                                isAssigned 
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                    : 'bg-[#ff8a65] hover:bg-[#ff7043] text-white'
                            }`}
                            disabled={!selectedStaff || assignMutation.isPending || isAssigned}
                            onClick={() => {
                                if (selectedStaff && !isAssigned) {
                                    assignMutation.mutate({ deliveryId: delivery._id, deliveryPersonnelId: selectedStaff._id }, {
                                        onSuccess: () => {
                                            setSelectedStaff(null);
                                            onClose();
                                            queryClient.invalidateQueries({ queryKey: ["deliveries"] });
                                        }
                                    });
                                }
                            }}
                        >
                            {isAssigned ? 'Đã phân công' : (assignMutation.isPending ? 'Đang phân công...' : 'Phân công')}
                        </button>
                    </div>
                )}
                {delivery.status === 'failed' && (
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-lg transition"
                        disabled={updateOrderStatusMutation.isPending}
                        onClick={() => {
                            updateOrderStatusMutation.mutate(
                                { orderId: delivery.orderId, orderStatus: 'Cancelled' },
                                {
                                    onSuccess: () => {
                                        onClose();
                                        queryClient.invalidateQueries({ queryKey: ["deliveries"] });
                                    }
                                }
                            );
                        }}
                    >
                        {updateOrderStatusMutation.isPending ? 'Đang hủy...' : 'Hủy đơn hàng'}
                    </button>
                )}
                {delivery.status === 'delivered' && (
                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-lg transition"
                        disabled={updateOrderStatusMutation.isPending}
                        onClick={() => {
                            updateOrderStatusMutation.mutate(
                                { orderId: delivery.orderId, orderStatus: 'Delivered' },
                                {
                                    onSuccess: () => {
                                        onClose();
                                        queryClient.invalidateQueries({ queryKey: ["deliveries"] });
                                        queryClient.invalidateQueries({ queryKey: ["orders"] });
                                    },
                                    onError: (error) => {
                                        console.error('[DEBUG] Lỗi xác nhận hoàn thành đơn hàng:', error);
                                        if (error?.response) {
                                            console.error('[DEBUG] Response status:', error.response.status);
                                            console.error('[DEBUG] Response data:', error.response.data);
                                        }
                                    }
                                }
                            );
                        }}
                    >
                        {updateOrderStatusMutation.isPending ? 'Đang hoàn thành...' : 'Hoàn thành đơn hàng'}
                    </button>
                )}
                  </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DeliveryDetailDialog;
