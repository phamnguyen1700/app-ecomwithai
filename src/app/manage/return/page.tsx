"use client";
import { Button } from "@/components/ui/button";
import {
    useApproveReturn,
    useRejectReturn,
    useReturnAdminAllQuery,
} from "@/tanstack/return";
import Image from "next/image";
import React, { useState } from "react";

const ReturnPage = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, refetch } = useReturnAdminAllQuery({
        page,
        limit,
    });
    const approve = useApproveReturn();
    const reject = useRejectReturn();

    const returns = data?.data ?? [];
    const meta = data?.meta ?? { totalItems: 0, totalPages: 1, currentPage: 1 };

    const handleApprove = (id: string) => {
        approve.mutate(id, { onSuccess: () => refetch() });
    };

    const handleReject = (id: string) => {
        reject.mutate(id, { onSuccess: () => refetch() });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            <h1 className="text-2xl font-bold">Quản lý yêu cầu trả hàng</h1>

            {isLoading ? (
                <p>Đang tải...</p>
            ) : returns.length === 0 ? (
                <p>Không có yêu cầu trả hàng nào.</p>
            ) : (
                <>
                    {returns.map((item: any) => (
                        <div
                            key={item._id}
                            className="border rounded-md p-4 shadow-sm space-y-2 bg-white"
                        >
                            <p>
                                <strong>Người dùng:</strong>{" "}
                                {item.userId?.email}
                            </p>
                            <p>
                                <strong>Đơn hàng:</strong> {item.orderId}
                            </p>
                            <p>
                                <strong>Số lượng:</strong> {item.quantity}
                            </p>
                            <p>
                                <strong>Lý do:</strong> {item.reason}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                <span
                                    className={
                                        item.status === "approved"
                                            ? "text-green-600"
                                            : item.status === "rejected"
                                            ? "text-red-600"
                                            : "text-yellow-500"
                                    }
                                >
                                    {item.status}
                                </span>
                            </p>
                            <p>
                                <strong>Ngày tạo:</strong>{" "}
                                {new Date(item.createdAt).toLocaleString(
                                    "vi-VN"
                                )}
                            </p>
                            {item.images && item.images.length > 0 && (
                                <div className="flex gap-3 mt-2">
                                    {item.images.map(
                                        (url: string, index: number) => (
                                            <Image
                                                width={60}
                                                height={60}
                                                key={index}
                                                src={url}
                                                alt={`Ảnh ${index + 1}`}
                                                className="w-24 h-24 object-cover rounded-md border"
                                            />
                                        )
                                    )}
                                </div>
                            )}
                            {item.status === "pending" && (
                                <div className="flex justify-end gap-3 pt-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleApprove(item._id)}
                                    >
                                        Duyệt
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleReject(item._id)}
                                    >
                                        Từ chối
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-center items-center gap-4 pt-4">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            ← Trước
                        </Button>
                        <span>
                            Trang {meta.currentPage} / {meta.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={page === meta.totalPages}
                            onClick={() =>
                                setPage((p) => Math.min(meta.totalPages, p + 1))
                            }
                        >
                            Tiếp →
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReturnPage;
