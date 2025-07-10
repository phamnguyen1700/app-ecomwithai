"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableRow,
    TableHeader,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { useProducts } from "@/tanstack/product";
import { Card, Skeleton } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

export default function ProductPage() {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 2,
        name: "",
    });

    const { data, isLoading, isFetching } = useProducts(filters);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, name: e.target.value, page: 1 }));
    };

    const handlePageChange = (direction: "prev" | "next") => {
        setFilters((prev) => ({
            ...prev,
            page:
                direction === "prev"
                    ? Math.max(prev.page - 1, 1)
                    : prev.page + 1,
        }));
    };

    const products = data?.data ?? [];
    const meta = data?.meta ?? { currentPage: 1, totalPages: 1 };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
                <Input
                    placeholder="Tìm theo tên sản phẩm"
                    value={filters.name}
                    onChange={handleSearch}
                    className="w-[300px]"
                />
            </div>

            {isLoading || isFetching ? (
                <Skeleton className="w-full h-64" />
            ) : (
                <div className="space-y-6">
                    {products.map((product: any) => (
                        <>
                            <Card
                                key={product._id}
                                className="p-6 space-y-4 bg-muted/30 shadow-sm border border-muted"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold text-primary">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm">
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                {product.brand}
                                            </span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {product.description}
                                        </p>
                                    </div>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Xem chi tiết
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-lg">
                                                    {product.name}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {product.description}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                                <div>
                                                    <p>
                                                        <strong>
                                                            Thương hiệu:
                                                        </strong>{" "}
                                                        {product.brand}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Thành phần:
                                                        </strong>{" "}
                                                        {product.ingredients?.join(
                                                            ", "
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        <strong>
                                                            Loại da:
                                                        </strong>{" "}
                                                        {product.suitableForSkinTypes?.join(
                                                            ", "
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Vấn đề da:
                                                        </strong>{" "}
                                                        {product.skinConcerns?.join(
                                                            ", "
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h4 className="font-semibold mb-2">
                                                    Danh sách SKU
                                                </h4>
                                                <div className="rounded-md border overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    SKU
                                                                </TableHead>
                                                                <TableHead>
                                                                    Giá
                                                                </TableHead>
                                                                <TableHead>
                                                                    Kho
                                                                </TableHead>
                                                                <TableHead>
                                                                    Loại
                                                                </TableHead>
                                                                <TableHead>
                                                                    HSD
                                                                </TableHead>
                                                                <TableHead className="text-right">
                                                                    Giảm giá
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {product.skus
                                                                ?.length ? (
                                                                product.skus.map(
                                                                    (
                                                                        sku: any
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                sku._id
                                                                            }
                                                                        >
                                                                            <TableCell>
                                                                                {
                                                                                    sku.variantName
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="text-green-600 font-medium">
                                                                                {sku.price.toLocaleString(
                                                                                    "vi-VN"
                                                                                )}{" "}
                                                                                ₫
                                                                            </TableCell>
                                                                            <TableCell
                                                                                className={
                                                                                    sku.stock <
                                                                                    10
                                                                                        ? "text-red-500"
                                                                                        : ""
                                                                                }
                                                                            >
                                                                                {
                                                                                    sku.stock
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
                                                                                    {
                                                                                        sku.formulationType
                                                                                    }
                                                                                </span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {new Date(
                                                                                    sku.expiredAt
                                                                                ).toLocaleDateString(
                                                                                    "vi-VN"
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell className="text-right text-orange-500">
                                                                                {
                                                                                    sku.discount
                                                                                }
                                                                                %
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                )
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={
                                                                            6
                                                                        }
                                                                        className="text-center"
                                                                    >
                                                                        Không có
                                                                        SKU
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* SKU Table outside of Dialog */}
                                <div className="rounded-md border bg-background overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>SKU</TableHead>
                                                <TableHead>Giá</TableHead>
                                                <TableHead>Kho</TableHead>
                                                <TableHead>Loại</TableHead>
                                                <TableHead>HSD</TableHead>
                                                <TableHead className="text-right">
                                                    Giảm giá
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {product.skus?.length ? (
                                                product.skus.map((sku: any) => (
                                                    <TableRow key={sku._id}>
                                                        <TableCell>
                                                            {sku.variantName}
                                                        </TableCell>
                                                        <TableCell className="text-green-600 font-medium">
                                                            {sku.price.toLocaleString(
                                                                "vi-VN"
                                                            )}{" "}
                                                            ₫
                                                        </TableCell>
                                                        <TableCell
                                                            className={
                                                                sku.stock < 10
                                                                    ? "text-red-500"
                                                                    : ""
                                                            }
                                                        >
                                                            {sku.stock}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
                                                                {
                                                                    sku.formulationType
                                                                }
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                sku.expiredAt
                                                            ).toLocaleDateString(
                                                                "vi-VN"
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right text-orange-500">
                                                            {sku.discount}%
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        className="text-center"
                                                    >
                                                        Không có SKU
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        </>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center pt-4">
                <Button
                    variant="outline"
                    onClick={() => handlePageChange("prev")}
                    disabled={+meta.currentPage <= 1}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Trang trước
                </Button>
                <span>
                    Trang {meta.currentPage} / {meta.totalPages}
                </span>
                <Button
                    variant="outline"
                    onClick={() => handlePageChange("next")}
                    disabled={+meta.currentPage >= +meta.totalPages}
                >
                    Trang sau
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
