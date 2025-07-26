"use client";
import { Button } from "@/components/ui/button";
import { useDeleteReviewAdmin, useReviewAdminQuery } from "@/tanstack/review";
import { useAllUser } from "@/tanstack/user";
import React, { useEffect, useState } from "react";

const ReviewPage = () => {
    const [mounted, setMounted] = useState(false);
    const [page, setPage] = useState(1);

    const limit = 10;
    const { data, isLoading } = useReviewAdminQuery({ page, limit });
    const { data: users = [] } = useAllUser({ limit: 9999 });

    const { mutate: deleteReview, isPending: isDeleting } =
        useDeleteReviewAdmin();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const reviews = data?.data || [];
    const total = data?.data?.length || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
            <h1 className="text-2xl font-semibold">Quản lý đánh giá</h1>

            {isLoading ? (
                <p>Đang tải...</p>
            ) : (
                <>
                    {reviews.length === 0 ? (
                        <p>Không có đánh giá nào.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review: any) => {
                                const user = users?.data?.find(
                                    (u: any) => u._id === review.userId
                                );

                                console.log(user);

                                return (
                                    <div
                                        key={review._id}
                                        className="p-4 border rounded shadow-sm"
                                    >
                                        <div className="font-semibold">
                                            {user?.email || "Ẩn danh"}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {review.product?.name}
                                        </div>
                                        <div className="mt-2 text-sm">
                                            {review.comment}
                                        </div>
                                        <div className="text-yellow-500 mt-1 text-sm">
                                            {Array.from({
                                                length: review.rating,
                                            }).map((_, i) => (
                                                <span key={i}>⭐</span>
                                            ))}
                                        </div>
                                        <div className="text-right mt-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Bạn có chắc chắn muốn xoá đánh giá này?"
                                                        )
                                                    ) {
                                                        deleteReview(
                                                            review._id
                                                        );
                                                    }
                                                }}
                                                disabled={isDeleting}
                                            >
                                                Xoá
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 pt-6">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={page === 1}
                        >
                            ← Trước
                        </Button>
                        <span className="text-sm">
                            Trang {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                )
                            }
                            disabled={page === totalPages}
                        >
                            Tiếp →
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReviewPage;
