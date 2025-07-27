"use client";

import CustomTable from "@/components/common/CustomTable";
import { IOrder } from "@/types/order";
import { formatMoney } from "@/hooks/formatMoney";
import { formatDateToDisplay } from "@/hooks/formatDateToDisplay";
import { useEffect, useState } from "react";
import OrderDetailDialog from "./orderDetailDialog";
import { useAllOrder } from "@/tanstack/order";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllUser } from "@/tanstack/user";
import { User } from "@/types/user";
import { ORDER_STATUS_LABELS } from "@/constants/label";
import { Badge } from "@/components/ui/badge";

export default function OrderTable() {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [open, setOpen] = useState(false);
    const [orderData, setOrderData] = useState<IOrder[]>([]);
    const [usersData, setUsersData] = useState<User[]>([]);
    const allOrderQuery = useAllOrder({
        page: 1,
        limit: 10,
    });
    const orders = allOrderQuery.data;
    const { data: users } = useAllUser({
        page: 1,
        limit: 10,
    });
    const [status, setStatus] = useState("Pending");
    const filteredOrders = orderData.filter((order) => order.orderStatus === status);

    const handleStatusChange = (value: string) => {
        setStatus(value);
    };

    useEffect(() => {
        if (orders?.data && users?.data) {
            setOrderData(orders.data);
            setUsersData(users.data);
        }
    }, [orders, users]);

    const handleRowClick = (order: IOrder) => {
        setSelectedOrder(order);
        setOpen(true);
    };

    const columns = [
        {
            colName: "Mã Đơn",
            render: (order: IOrder) => <div className="text-xs text-left">{order._id}</div>,
        },
        {
            colName: "Khách Hàng",
            render: (order: IOrder) => <div className="text-xs text-left">{usersData.find((user) => user._id === order.userId)?.email || "—"}</div>,
        },
        {
            colName: "Tổng Tiền",
            render: (order: IOrder) => (
                <div className="text-xs text-center">{formatMoney(order.totalAmount)}</div>
            ),
        },
        {
            colName: "Thanh Toán",
            render: (order: IOrder) => (
                <div className="text-xs text-center">
                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </div>
            ),
        },
        {
            colName: "Trạng Thái",
            render: (order: IOrder) => {
                let variant: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" = "default";
                switch (order.orderStatus) {
                    case "Pending":
                        variant = "warning";
                        break;
                    case "Shipped":
                        variant = "outline";
                        break;
                    case "Delivered":
                        variant = "success";
                        break;
                    case "Cancelled":
                        variant = "destructive";
                        break;
                    default:
                        variant = "default";
                }
                return (
                    <Badge variant={variant} className="w-full justify-center">
                        {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                    </Badge>
                );
            },
        },
        {
            colName: "Ngày đặt",
            render: (order: IOrder) => (
                <div className="text-xs text-center">{formatDateToDisplay(order.createdAt)}</div>
            ),
        },
    ];

    return (
        <>
            <Tabs value={status} onValueChange={handleStatusChange} className="w-full mb-4">
                <TabsList className="w-full flex">
                    <TabsTrigger value="Pending" className="flex-1">Đang chờ</TabsTrigger>
                    <TabsTrigger value="Shipped" className="flex-1">Đang giao</TabsTrigger>
                    <TabsTrigger value="Delivered" className="flex-1">Đã giao</TabsTrigger>
                    <TabsTrigger value="Cancelled" className="flex-1">Đã hủy</TabsTrigger>
                </TabsList>
            </Tabs>
            <CustomTable columns={columns} records={filteredOrders || []} onRowClick={handleRowClick} />
            <OrderDetailDialog
                usersData={usersData}
                order={selectedOrder}
                isOpen={open}
                onClose={() => setOpen(false)}
                onDeliverySuccess={() => {
                  allOrderQuery.refetch();
                }}
            />
        </>
    );
}
