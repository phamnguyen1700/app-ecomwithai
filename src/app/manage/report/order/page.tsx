"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OrderDetailModal } from "@/modules/order";
import { MonthlySalesChart } from "@/modules/order/Chart";
import { useAllOrder, useAnalytics } from "@/tanstack/order";
import { useAllUser } from "@/tanstack/user";
import { useMemo, useState } from "react";

export default function Report() {
    const [filter, setFilter] = useState({
        email: "",
        status: "",
        page: 1,
        limit: 10,
    });

    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const { data } = useAllOrder(filter);
    console.log(data);
    
    const { data: analytics } = useAnalytics();
    const { data: users } = useAllUser();

    const onChange = (key: string, value: string) => {
        if (key === "email") {
            const found = users?.data?.find(
                (u) =>
                    u.email &&
                    u.email.toLowerCase().includes(value.toLowerCase())
            );
            setFilter((prev) => ({
                ...prev,
                email: value,
                userId: found?._id || "",
            }));
        } else {
            setFilter((prev) => ({ ...prev, [key]: value }));
        }
    };
    const userMap = useMemo(() => {
        const map = new Map();
        users?.data?.forEach((u) => map.set(u._id, u.email));
        return map;
    }, [users]);
    return (
        <main className="p-10 space-y-6">
            <h1 className="text-4xl font-bold text-center">Order Report</h1>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <Input
                            placeholder="Search by email"
                            value={filter.email}
                            onChange={(e) => onChange("email", e.target.value)}
                            className="min-w-[200px]"
                        />
                        <Select
                            value={filter.status}
                            onValueChange={(val) =>
                                onChange("status", val === "all" ? "" : val)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">
                                    Processing
                                </SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">
                                    Delivered
                                </SelectItem>
                                <SelectItem value="Cancelled">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-2xl border bg-background p-4 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">
                            Danh sách đơn hàng
                        </h2>
                        <div className="overflow-auto max-h-[600px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment Method</TableHead>
                                        <TableHead>Payment Status</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(data?.data) &&
                                        data.data.map((order: any) => (
                                            <TableRow key={order._id}>
                                                <TableCell>
                                                    {userMap.get(
                                                        order.userId
                                                    ) || order.userId}
                                                </TableCell>
                                                <TableCell>
                                                    {order.orderStatus}
                                                </TableCell>
                                                <TableCell>
                                                    {order.paymentMethod}
                                                </TableCell>
                                                <TableCell>
                                                    {order.paymentStatus}
                                                </TableCell>
                                                <TableCell>
                                                    {order.totalAmount?.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleString("vi-VN")}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setSelectedOrderId(
                                                                order._id
                                                            )
                                                        }
                                                    >
                                                        Xem
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination className="mt-4" />
                    </div>
                </div>

                <div className="w-full lg:max-w-md">
                    <div className="rounded-2xl border bg-background p-6 shadow-sm h-full">
                        <h2 className="text-xl font-semibold mb-4">
                            Thống kê theo tháng
                        </h2>
                        <MonthlySalesChart
                            data={analytics?.monthlySales || []}
                        />
                    </div>
                </div>
            </div>
            <OrderDetailModal
                orderId={selectedOrderId}
                open={!!selectedOrderId}
                onOpenChange={() => setSelectedOrderId(null)}
            />
        </main>
    );
}
