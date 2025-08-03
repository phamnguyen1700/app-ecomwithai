"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateReview,
    useUpdateReview
} from "@/tanstack/review";

import Image from "next/image";
import imageCompression from "browser-image-compression";
import { Star, Trash2 } from "lucide-react";
import { IReview, ICreateReview } from "@/types/review";

interface ReviewDialogProps {
    open: boolean;
    onClose: () => void;
    userId?: string;
    deliveriesData?: any[];
    ordersData?: any[];
    productsData?: any[];
    reviewsData?: IReview[];
    isLoadingDeliveries?: boolean;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
    open,
    onClose,
    ordersData = [],
    productsData = [],
    reviewsData = [],
    isLoadingDeliveries = false
}) => {
    const [selectedDelivery, setSelectedDelivery] = useState<IReview | null>(null);
    const [formData, setFormData] = useState<ICreateReview>({
        comment: "",
        rating: 5,
        productId: "",
        orderId: "",
        deliveryId: "",
    });
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingReview, setEditingReview] = useState<IReview | null>(null);
    const createReview = useCreateReview();
    const updateReview = useUpdateReview();
    // Get product info from productsData
    const selectedProduct = selectedDelivery ? productsData?.find(
        (p: any) => p._id === selectedDelivery.productId
    ) : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && editingReview) {
            updateReview.mutate(
                {
                    id: editingReview._id,
                    data: {
                        rating: formData.rating,
                        comment: formData.comment,
                        images: imageUrls,
                    },
                },);
        } else {
            createReview.mutate(
                { ...formData, images: imageUrls },

            );
        }
    };

    const resetForm = () => {
        setFormData({
            comment: "",
            rating: 5,
            productId: "",
            orderId: "",
            deliveryId: "",
        });
        setImageUrls([]);
        setIsEditMode(false);
        setEditingReview(null);
        setSelectedDelivery(null);
    };

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        const uploadedUrls: string[] = [];

        for (const file of fileArray) {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            });

            const url = await uploadToCloudinary(compressed);
            if (url) uploadedUrls.push(url);
        }

        setImageUrls((prev) => [...prev, ...uploadedUrls]);
    };

    const uploadToCloudinary = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dt8tjzhz3/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();
            return data.secure_url;
        } catch (error) {
            console.error("Upload failed:", error);
            return null;
        }
    };

    const handleSelectReview = (review: IReview) => {

        setSelectedDelivery(review);
        setFormData({
            comment: review.comment,
            rating: review.rating,
            orderId: review.orderId,
            deliveryId: review.deliveryId,
            productId: review.productId,
        });
        setImageUrls(review.images || []);
        setIsEditMode(true);
        setEditingReview(review);
    };

    const removeImage = (index: number) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSoftDeleteReview = (reviewId: string) => {
        updateReview.mutate({
            id: reviewId,
            data: { deleted: true }
        }, {
            onSuccess: () => {
                if (selectedDelivery?._id === reviewId) {
                    setSelectedDelivery(null);
                    resetForm();
                }
            },
        });
    };

    const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void, size: "sm" | "md" = "md") => {
        const starSize = size === "sm" ? "w-3 h-3" : "w-5 h-5";

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : undefined}
                        onClick={interactive ? () => onRatingChange?.(star) : undefined}
                        className={interactive ? "cursor-pointer" : ""}
                        disabled={!interactive}
                    >
                        {star <= rating ? (
                            <Star className={`${starSize} text-yellow-400 fill-current`} />
                        ) : (
                            <Star className={`${starSize} text-gray-300`} />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    const matchedOrder = selectedDelivery ? ordersData?.find(
        (o: any) => o._id === selectedDelivery.orderId
    ) : null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {isEditMode ? "Chỉnh sửa đánh giá" : "Viết đánh giá sản phẩm"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex gap-4 h-[calc(80vh-100px)]">
                    {/* LEFT: Review Cards */}
                    <div className="w-1/2 overflow-y-auto space-y-2 pr-3">
                        <h3 className="text-lg font-semibold mb-4">Đánh giá của bạn</h3>
                        {isLoadingDeliveries ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-gray-500">Đang tải dữ liệu...</p>
                            </div>
                        ) : reviewsData.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">⭐</div>
                                <p className="text-gray-500">Chưa có đánh giá nào</p>
                            </div>
                        ) : (
                            reviewsData.map((review: IReview) => {
                                const order = ordersData?.find(
                                    (o: any) => o._id === review.orderId
                                );
                                const product = order?.items?.[0];

                                return (
                                    <Card
                                        key={review._id}
                                        className={`cursor-pointer transition-all hover:shadow-md ${selectedDelivery?._id === review._id
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200"
                                            }`}
                                        onClick={() => handleSelectReview(review)}
                                    >
                                        <CardContent className="p-2">
                                            <div className="flex gap-2">
                                                {product && (
                                                    <Image
                                                        width={56}
                                                        height={56}
                                                        src={product.image || "/assets/blank.jpg"}
                                                        alt="product"
                                                        className="w-24 h-24 rounded-md object-cover border flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div className="text-xs font-medium text-gray-600 truncate">
                                                            #{review.orderId.slice(-6)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-xs text-green-600 bg-green-100 rounded flex-shrink-0">
                                                                Đã đánh giá
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSoftDeleteReview(review._id);
                                                                }}
                                                            >
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {product && (
                                                        <div className="text-xs font-medium mb-0.5 truncate">
                                                            {product.skuName}
                                                        </div>
                                                    )}

                                                    <div className="text-xs text-gray-500 mb-0.5">
                                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                    </div>

                                                    <div className="mb-0.5">
                                                        {renderStars(review.rating, false, undefined, "sm")}
                                                    </div>

                                                    {review.comment && (
                                                        <div className="text-xs text-gray-600 line-clamp-1">
                                                            {review.comment}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* RIGHT: Review Form */}
                    <div className="w-1/2 bg-white border overflow-y-auto rounded-lg p-4">
                        {selectedDelivery ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Product Info */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-semibold mb-3">Thông tin sản phẩm</h3>
                                    <div className="flex gap-4">
                                        {selectedProduct && (
                                            <Image
                                                width={80}
                                                height={80}
                                                src={selectedProduct.image || "/assets/blank.jpg"}
                                                alt="product"
                                                className="w-20 h-20 rounded-md object-cover border"
                                            />
                                        )}
                                        <div>
                                            {selectedProduct && (
                                                <div className="font-medium">{selectedProduct.name}</div>
                                            )}
                                            <div className="text-sm text-gray-500">
                                                Đơn hàng: #{selectedDelivery.orderId.slice(-8)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Đánh giá ngày: {new Date(selectedDelivery.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                            {matchedOrder && (
                                                <div className="text-sm text-gray-500">
                                                    Tổng tiền: {matchedOrder.total?.toLocaleString('vi-VN')}₫
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Đánh giá</Label>
                                    {renderStars(formData.rating, true, (rating) =>
                                        setFormData({ ...formData, rating })
                                    )}
                                </div>

                                {/* Comment */}
                                <div>
                                    <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
                                        Nhận xét
                                    </Label>
                                    <Textarea
                                        id="comment"
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                        className="min-h-[100px]"
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Hình ảnh</Label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleUploadImage}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {imageUrls.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {imageUrls.map((url, idx) => (
                                                <div key={idx} className="relative">
                                                    <Image
                                                        src={url}
                                                        alt={`uploaded-${idx}`}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-md border object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={createReview.isPending || updateReview.isPending}
                                        className="flex-1"
                                    >
                                        {createReview.isPending || updateReview.isPending
                                            ? "Đang lưu..."
                                            : isEditMode ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleSoftDeleteReview(selectedDelivery._id)}
                                        disabled={updateReview.isPending}
                                        className="px-3"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        {updateReview.isPending ? "Đang xóa..." : "Xóa"}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">📦</div>
                                    <p>Chọn một sản phẩm để viết đánh giá</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;
