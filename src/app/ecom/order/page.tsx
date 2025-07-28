"use client";

import React, { useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryResult,
} from "@tanstack/react-query";
import { getMyOrders, cancelOrder } from "@/zustand/services/order";
import { useProducts } from "@/tanstack/product";
import { useDeliveriesCustomer } from "@/tanstack/delivery";
import { IOrder } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { formatDateToDisplay } from "@/hooks/formatDateToDisplay";
import { formatMoney } from "@/hooks/formatMoney";
import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import ReturnRequestDialog from "@/components/common/ReturnModa";
import { useRouter } from "next/navigation";

export default function OrderPage() {
    const queryClient = useQueryClient();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [orderToCancel, setOrderToCancel] = useState<IOrder | null>(null);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState("");
    const { data: products } = useProducts();
    const { data: deliveries } = useDeliveriesCustomer({ limit: 999 });
    const router = useRouter();

    const handleOpenReturnDialog = (orderId: string) => {
        setSelectedOrderId(orderId);
        setOpenReturnDialog(true);
    };

    const handleOpenReviewDialog = (productId: string, orderId: string, deliveryId: string) => {
        // Chuyển hướng đến trang sản phẩm với query params
        router.push(`/ecom/product/${productId}?review=true&orderId=${orderId}&deliveryId=${deliveryId}`);
    };
    const handleShowDetail = (order: IOrder) => {
        setSelectedOrder(order);
    };
    const {
        data: orders = [],
        isLoading,
        error,
    }: UseQueryResult<IOrder[], Error> = useQuery({
        queryKey: ["myOrders"],
        queryFn: getMyOrders,
    });
    
    const cancelMutation = useMutation<void, Error, string>({
        mutationFn: cancelOrder,
        onMutate: (orderId: string) => {
            setUpdatingId(orderId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myOrders"] });
        },
        onSettled: () => {
            setUpdatingId(null);
        },
    });

    if (isLoading) return <div>Đang tải đơn hàng…</div>;
    console.log(orders)
    if (error) return <div>Có lỗi: {error.message}</div>;
    const handleOpenCancelDialog = (order: IOrder) => {
        setOrderToCancel(order);
        setIsCancelDialogOpen(true);
    };

    const handleConfirmCancel = () => {
        if (orderToCancel) {
            cancelMutation.mutate(orderToCancel._id);
            setIsCancelDialogOpen(false);
        }
    };
    return (
        <>
            <div className="py-4 px-6 mt-24 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>

                {orders.length > 0 ? (
                    <div className="flex gap-6 h-[calc(100vh-280px)] max-h-[calc(100vh-280px)]">
                        {/* LEFT: Order Cards */}
                        <div className="w-1/3 overflow-y-auto space-y-3 pr-4">
                                {orders.map((order: IOrder) => {
                                let variant: BadgeProps["variant"] = "default";
                                let badgeClass = "";
                                
                                switch (order.orderStatus) {
                                    case "Pending":
                                        variant = "default";
                                        badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:text-yellow-800";
                                        break;
                                    case "Processing":
                                        variant = "default";
                                        badgeClass = "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-800";
                                        break;
                                    case "Shipped":
                                        variant = "default";
                                        badgeClass = "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:text-purple-800";
                                        break;
                                    case "Delivered":
                                        variant = "default";
                                        badgeClass = "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-800";
                                        break;
                                    case "Cancelled":
                                        variant = "default";
                                        badgeClass = "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-800";
                                        break;
                                    default:
                                        variant = "default";
                                        badgeClass = "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-800";
                                }

                                    return (
                                    <div
                                            key={order._id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                            selectedOrder?._id === order._id
                                                ? "border-primary bg-primary/5"
                                                : "border-gray-200 bg-white"
                                        }`}
                                        onClick={() => handleShowDetail(order)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm font-medium text-gray-600">
                                                #{order._id.slice(-8)}
                                            </div>
                                            <Badge variant={variant} className={`text-xs ${badgeClass}`}>
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                        
                                        <div className="text-lg font-bold mb-2">
                                            {order.totalAmount.toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                            })}
                                        </div>
                                        
                                        <div className="text-sm text-gray-500 mb-3">
                                            {formatDateToDisplay(order.createdAt)}
                                        </div>
                                        
                                                                                <div className="flex justify-between items-center">
                                            {order.orderStatus === "Pending" && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={updatingId === order._id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenCancelDialog(order);
                                                    }}
                                                >
                                                    {updatingId === order._id ? "Đang hủy…" : "Hủy"}
                                                </Button>
                                            )}
                                            
                                            {order.orderStatus === "Delivered" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="ml-auto"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenReturnDialog(order._id);
                                                    }}
                                                >
                                                    Trả hàng
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    );
                                })}
                        </div>

                        {/* RIGHT: Order Detail */}
                        <div className="w-2/3 bg-white border rounded-lg px-4 pt-2 overflow-hidden">
                            {selectedOrder ? (
                                <div className="h-full overflow-y-auto">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">Chi tiết đơn hàng:</h2>
                                        <Badge variant="default" className={
                                            selectedOrder.orderStatus === "Pending" ? "mr-7 bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:text-yellow-800" :
                                            selectedOrder.orderStatus === "Processing" ? "mr-7 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-800" :
                                            selectedOrder.orderStatus === "Shipped" ? "mr-7 bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:text-purple-800" :
                                            selectedOrder.orderStatus === "Delivered" ? "mr-7 bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-800" :
                                            selectedOrder.orderStatus === "Cancelled" ? "mr-7 bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-800" :
                                            "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-800"
                                        }>
                                            {selectedOrder.orderStatus}
                                        </Badge>
                                    </div>

                                    {/* Order Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div className="min-w-0">
                                            <Label className="text-sm font-medium text-gray-600">Mã đơn</Label>
                                            <div className="text-sm truncate">{selectedOrder._id}</div>
                                        </div>
                                        <div className="min-w-0">
                                            <Label className="text-sm font-medium text-gray-600">Tổng tiền</Label>
                                            <div className="text-lg font-bold text-primary">
                                                {selectedOrder.totalAmount.toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <Label className="text-sm font-medium text-gray-600">Phương thức thanh toán</Label>
                                            <div className="text-sm truncate">{selectedOrder.paymentMethod}</div>
                                        </div>
                                        <div className="min-w-0">
                                            <Label className="text-sm font-medium text-gray-600">Trạng thái thanh toán</Label>
                                            <div className="text-sm truncate">{selectedOrder.paymentStatus}</div>
                                        </div>
                                        <div className="min-w-0">
                                            <Label className="text-sm font-medium text-gray-600">Ngày tạo</Label>
                                            <div className="text-sm">{formatDateToDisplay(selectedOrder.createdAt)}</div>
                                        </div>
                                        <div className="min-w-0">
                                            <Label className="text-sm font-medium text-gray-600">Đã thanh toán lúc</Label>
                                            <div className="text-sm">{formatDateToDisplay(selectedOrder.paidAt)}</div>
                                        </div>
                                    </div>

                                    {/* Products List */}
                                    <div>
                                        <h3 className="text-lg font-semibold">Danh sách sản phẩm: </h3>
                                        <div className="space-y-4 max-h-96-auto pr-2 pb-4">
                                            {selectedOrder.items?.map((item, index) => (
                                                <div
                                                    key={`${item.skuId}-${index}`}
                                                    className="p-4 border rounded-lg bg-gray-50 w-full"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="min-w-0">
                                                            <Label className="text-sm font-medium text-gray-600">Tên sản phẩm</Label>
                                                            <div className="text-sm truncate">{products?.data.find(product => product._id === item.productId)?.name}</div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <Label className="text-sm font-medium text-gray-600">Phiên bản</Label>
                                                            <div className="text-sm truncate">{item.skuName}</div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <Label className="text-sm font-medium text-gray-600">Giá & Số lượng</Label>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    {item.discountSnapshot > 0 ? (
                                                                        <>
                                                                            <span className="text-sm text-gray-400 line-through">
                                                                                {formatMoney(item.priceSnapshot)}
                                                                            </span>
                                                                            <span className="text-sm font-medium text-red-600">
                                                                                {formatMoney(item.priceSnapshot * (1 - item.discountSnapshot / 100))}
                                                                            </span>
                                                                            <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">
                                                                                -{item.discountSnapshot}%
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-sm font-medium">
                                                                            {formatMoney(item.priceSnapshot)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-sm text-gray-500">x{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex gap-2 mt-3">
                                                                {selectedOrder.orderStatus === "Delivered" && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            
                                                                            const delivery = deliveries?.data?.find((delivery: any) => 
                                                                                delivery.orderId === selectedOrder._id && 
                                                                                delivery.status === "delivered"
                                                                            );
                                                                            const deliveryId = delivery?._id || selectedOrder._id; 
                                                                            handleOpenReviewDialog(
                                                                                item.productId,
                                                                                selectedOrder._id,
                                                                                deliveryId
                                                                            );
                                                                        }}
                                                                    >
                                                                        Đánh giá
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📦</div>
                                        <p>Chọn một đơn hàng để xem chi tiết</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📦</div>
                    <p>Chưa có đơn hàng nào.</p>
                        </div>
                    </div>
                )}
                <ReturnRequestDialog
                    open={openReturnDialog}
                    onClose={() => setOpenReturnDialog(false)}
                    orderId={selectedOrderId}
                />
                

            </div>
            <Dialog
                open={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            Xác nhận hủy đơn hàng
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn hủy đơn hàng{" "}
                            <span className="font-medium text-black">
                                {orderToCancel?._id}
                            </span>{" "}
                            không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsCancelDialogOpen(false)}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmCancel}
                            disabled={cancelMutation.isPending}
                        >
                            {cancelMutation.isPending
                                ? "Đang hủy…"
                                : "Xác nhận hủy"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
