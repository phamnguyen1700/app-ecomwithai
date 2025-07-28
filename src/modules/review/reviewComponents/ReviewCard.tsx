"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview, useUpdateReview } from "@/tanstack/review";
import { useAuthStore } from "@/zustand/store/userAuth";
import { toast } from "react-toastify";
import { Star } from "lucide-react";
import { ICreateReview, IReview } from "@/types/review";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import imageCompression from "browser-image-compression";


interface ReviewCardProps {
    reviews: IReview[];
    productId: string;
    orderId?: string;
    deliveryId?: string;
    productName?: string;
    onReviewCreated?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    reviews,
    productId,
    orderId,
    deliveryId,
    productName = "Sản phẩm",
    onReviewCreated
}) => {
    const searchParams = useSearchParams();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [formData, setFormData] = useState<ICreateReview>({
        comment: "",
        rating: 5,
        productId,
        orderId: orderId || "",
        deliveryId: deliveryId || "",
    });
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingReview, setEditingReview] = useState<IReview | null>(null);

    const createReview = useCreateReview();
    const updateReview = useUpdateReview();
    const { user } = useAuthStore();
    const currentUserId = user?._id;

    // Check if user has already reviewed this product
    const userReview = reviews.find((review: IReview) => 
        review.productId === productId && review.userId._id === currentUserId
    );



    // Auto open modal if coming from order page (only once)
    useEffect(() => {
        const isReviewMode = searchParams.get('review') === 'true';
        if (isReviewMode && orderId && deliveryId) {
            // Check if user has already reviewed
            if (userReview) {
                toast.error("Bạn đã đánh giá sản phẩm này rồi!");
                return;
            }
            setIsCreateModalOpen(true);
            // Clear the review param from URL to prevent auto-opening again
            const url = new URL(window.location.href);
            url.searchParams.delete('review');
            url.searchParams.delete('orderId');
            url.searchParams.delete('deliveryId');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams, orderId, deliveryId, userReview]);

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

    const removeImage = (index: number) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.comment.trim()) {
            toast.error("Vui lòng nhập đánh giá!");
            return;
        }
        
        if (isEditMode && editingReview) {
            // Update existing review
            updateReview.mutate({
                id: editingReview._id,
                data: {
                    rating: formData.rating,
                    comment: formData.comment,
                    images: imageUrls,
                },
            }, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    onReviewCreated?.();
                },
            });
        } else {
            // Create new review
            createReview.mutate({
                ...formData,
                images: imageUrls
            }, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    onReviewCreated?.();
                },
            });
        }
    };

    const resetForm = () => {
        setFormData({
            comment: "",
            rating: 5,
            productId,
            orderId: orderId || "",
            deliveryId: deliveryId || "",
        });
        setImageUrls([]);
        setIsEditMode(false);
        setEditingReview(null);
    };

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const renderStars = (rating: number, interactive = true, size: "sm" | "md" = "md") => {
        const starSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={interactive ? () => handleRatingChange(star) : undefined}
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="space-y-4">
            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review: IReview) => (
                    <Card 
                        key={review._id} 
                        className={`hover:shadow-md transition-shadow h-fit cursor-pointer ${
                            review.userId._id === currentUserId ? 'border-blue-200' : ''
                        }`}
                        onClick={() => {
                            if (review.userId._id === currentUserId) {
                                setEditingReview(review);
                                setFormData({
                                    comment: review.comment,
                                    rating: review.rating,
                                    productId: review.productId,
                                    orderId: review.orderId,
                                    deliveryId: review.deliveryId,
                                });
                                setImageUrls(review.images || []);
                                setIsEditMode(true);
                                setIsCreateModalOpen(true);
                            }
                        }}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="font-medium text-sm mb-1">
                                        {review.userId.email}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                        {formatDate(review.createdAt)}
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {review.rating}/5
                                </Badge>
                            </div>
                            
                            <div className="mb-3">
                                {renderStars(review.rating, false, "sm")}
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                                {review.comment}
                            </p>
                            
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {review.images.slice(0, 3).map((url: string, idx: number) => (
                                        <div key={idx} className="relative w-12 h-12 rounded overflow-hidden">
                                            <Image
                                                src={url}
                                                alt={`review-${idx}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    {review.images.length > 3 && (
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                            +{review.images.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Review Button or User Review Status */}
            {reviews.length === 0 ? (
                <div className="text-center">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Viết đánh giá
                    </Button>
                </div>
            ) : userReview ? (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-600 font-medium">
                        Bạn đã đánh giá sản phẩm này rồi
                    </p>
                    <p className="text-sm text-blue-500 mt-1">
                        Click vào review của bạn để chỉnh sửa
                    </p>
                </div>
            ) : (
                <div className="text-center">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Viết đánh giá
                    </Button>
                </div>
            )}

            {/* Create Review Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {isEditMode ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-600">
                                Sản phẩm: {productName}
                            </Label>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-600 mb-2 block">
                                Đánh giá của bạn
                            </Label>
                            {renderStars(formData.rating)}
                        </div>

                        <div>
                            <Label htmlFor="comment" className="text-sm font-medium text-gray-600 mb-2 block">
                                Nhận xét
                            </Label>
                            <Textarea
                                id="comment"
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                value={formData.comment}
                                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <Label className="text-sm font-medium text-gray-600 mb-2 block">
                                Hình ảnh
                            </Label>
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

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="flex-1"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={createReview.isPending || updateReview.isPending}
                            >
                                {createReview.isPending || updateReview.isPending
                                    ? "Đang gửi..."
                                    : isEditMode ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReviewCard; 