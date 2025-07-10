"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useCoupons } from "@/tanstack/coupon";
import { useAllUser } from "@/tanstack/user";
import { Skeleton } from "antd";
import React, { useMemo, useState } from "react";

const CouponPage = () => {
    const [filters, setFilters] = useState<{
        code: string;
        email: string;
        isUsed?: boolean | undefined;
    }>({
        code: "",
        email: "",
        isUsed: undefined,
    });

    const { data, isLoading } = useCoupons(filters);
    const { data: users } = useAllUser();
    const coupons = data?.data ?? [];
    const userEmailMap = useMemo(() => {
        const map = new Map<string, string>();
        users?.data?.forEach((user: any) => {
            if (user._id && user.email) {
                map.set(user._id, user.email);
            }
        });
        return map;
    }, [users]);
    return (
        <div className="p-6 space-y-6">
            <Card className="p-6 space-y-4 shadow-sm border border-muted bg-muted/30">
                <h2 className="text-xl font-bold text-primary">
                    🎟️ Danh sách mã giảm giá
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                        placeholder="🔍 Tìm theo mã coupon"
                        value={filters.code}
                        onChange={(e) =>
                            setFilters({ ...filters, code: e.target.value })
                        }
                    />
                    <Input
                        placeholder="📧 Tìm theo email người dùng"
                        value={filters.email}
                        onChange={(e) =>
                            setFilters({ ...filters, email: e.target.value })
                        }
                    />
                    <Select
                        onValueChange={(val) => {
                            if (val === "true") {
                                setFilters((prev) => ({
                                    ...prev,
                                    isUsed: true,
                                }));
                            } else if (val === "false") {
                                setFilters((prev) => ({
                                    ...prev,
                                    isUsed: false,
                                }));
                            } else {
                                setFilters((prev) => {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    const { isUsed: _, ...rest } = prev;
                                    return rest;
                                });
                            }
                        }}
                        value={
                            filters.isUsed === true
                                ? "true"
                                : filters.isUsed === false
                                ? "false"
                                : "all"
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Trạng thái sử dụng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="true">Đã sử dụng</SelectItem>
                            <SelectItem value="false">Chưa sử dụng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <Card className="p-4 shadow-sm border bg-background rounded-xl">
                {isLoading ? (
                    <Skeleton className="w-full h-48" />
                ) : (
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">
                                        Mã
                                    </TableHead>
                                    <TableHead>Giá trị</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-center">
                                        Trạng thái
                                    </TableHead>
                                    <TableHead className="text-right w-[180px]">
                                        Ngày tạo
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons.length ? (
                                    coupons.map((coupon: any) => (
                                        <TableRow key={coupon._id}>
                                            <TableCell className="font-semibold text-primary">
                                                {coupon.code}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                                                    {coupon.value}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {userEmailMap.get(
                                                    coupon.userId
                                                ) || "—"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={
                                                        coupon.isUsed
                                                            ? "bg-red-500 text-white"
                                                            : "bg-green-500 text-white"
                                                    }
                                                >
                                                    {coupon.isUsed
                                                        ? "Đã sử dụng"
                                                        : "Chưa sử dụng"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                {new Date(
                                                    coupon.createdAt
                                                ).toLocaleDateString("vi-VN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-4"
                                        >
                                            Không tìm thấy mã giảm giá nào.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CouponPage;
