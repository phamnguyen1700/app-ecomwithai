"use client";

import React, { useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryResult,
} from "@tanstack/react-query";
import { getMyOrders, cancelOrder } from "@/zustand/services/order";
import { IOrder } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { formatDateToDisplay } from "@/hooks/formatDateToDisplay";
import OrderDetailDialog from "@/app/ecom/order/OrderDetailDialog";
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

export default function OrderPage() {
    const queryClient = useQueryClient();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    // --- 1. useQuery now takes a single options object ---
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<IOrder | null>(null);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState("");

    const handleOpenReturnDialog = (orderId: string) => {
        setSelectedOrderId(orderId);
        setOpenReturnDialog(true);
    };
    const handleShowDetail = (order: IOrder) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };
    const {
        data: orders = [],
        isLoading,
        error,
    }: UseQueryResult<IOrder[], Error> = useQuery({
        queryKey: ["myOrders"],
        queryFn: getMyOrders,
    });

    // --- 2. useMutation also takes an options object, and we type it explicitly ---
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
            <div className="p-6 mt-24">
                <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>

                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-center">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Mã đơn</th>
                                    <th className="px-4 py-2">Tổng tiền</th>
                                    <th className="px-4 py-2">Thanh toán</th>
                                    <th className="px-4 py-2">Trạng thái</th>
                                    <th className="px-4 py-2">Ngày tạo</th>
                                    <th className="px-4 py-2">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order: IOrder) => {
                                    let variant: BadgeProps["variant"] =
                                        "default";
                                    if (order.orderStatus === "Cancelled")
                                        variant = "destructive";
                                    else if (order.orderStatus === "Shipped")
                                        variant = "outline";
                                    else if (order.orderStatus === "Delivered")
                                        variant = "secondary";

                                    return (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border px-4 py-2">
                                                {order._id}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {order.totalAmount.toLocaleString(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {order.paymentMethod}
                                            </td>
                                            <td className="border px-4 py-2">
                                                <Badge variant={variant}>
                                                    {order.orderStatus}
                                                </Badge>
                                            </td>
                                            <td className="border px-4 py-2">
                                                {formatDateToDisplay(
                                                    order.createdAt
                                                )}
                                            </td>
                                            <td className="border px-4 py-2 space-x-2">
                                                {order.orderStatus ===
                                                    "Pending" && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        disabled={
                                                            updatingId ===
                                                            order._id
                                                        }
                                                        onClick={() =>
                                                            handleOpenCancelDialog(
                                                                order
                                                            )
                                                        }
                                                    >
                                                        {updatingId ===
                                                        order._id
                                                            ? "Đang hủy…"
                                                            : "Hủy"}
                                                    </Button>
                                                )}

                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleShowDetail(order)
                                                    }
                                                >
                                                    Chi tiết
                                                </Button>

                                                {order.orderStatus ===
                                                    "Shipped" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleOpenReturnDialog(
                                                                order._id
                                                            )
                                                        }
                                                    >
                                                        Yêu cầu trả hàng
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Chưa có đơn hàng nào.</p>
                )}
                <OrderDetailDialog
                    order={selectedOrder}
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                />
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
