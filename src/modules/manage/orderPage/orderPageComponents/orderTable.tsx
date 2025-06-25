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

export default function OrderTable() {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [open, setOpen] = useState(false);
    const [orderData, setOrderData] = useState<IOrder[]>([]);
    const [usersData, setUsersData] = useState<User[]>([]);
    const { data: orders } = useAllOrder({
        page: 1,
        limit: 10,
    });
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
            render: (order: IOrder) => (
                <div className="text-xs text-center">{order.orderStatus}</div>
            ),
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
            <Tabs value={status} onValueChange={handleStatusChange} className="flex gap-4 mb-4 ...">
                <TabsList>
                    <TabsTrigger value="Pending">Pending</TabsTrigger>
                    <TabsTrigger value="Shipped">Shipped</TabsTrigger>
                    <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                    <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                </TabsList>
            </Tabs>
            <CustomTable columns={columns} records={filteredOrders || []} onRowClick={handleRowClick} />
            <OrderDetailDialog usersData={usersData} order={selectedOrder} isOpen={open} onClose={() => setOpen(false)} />
        </>
    );
}
