"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useProductDetail } from "@/tanstack/product";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ISku } from "@/types/product";
import { AddToCartButton } from "@/components/common/addToCartButton";
import AppSection from "@/components/core/AppSection";
import { HeartIcon } from "@/components/core/AppIcons";
import { useAuthStore } from "@/zustand/store/userAuth";
import { useReportReview, useReviewList } from "@/tanstack/review";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IReview } from "@/types/review";
import ReviewCard from "@/modules/review/reviewComponents/ReviewCard";
import { useQueryClient } from "@tanstack/react-query";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function ProductDetail() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { data: product, isLoading, error } = useProductDetail(id as string);
    const [quantity, setQuantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState<ISku | null>(null);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [openReport, setOpenReport] = useState(false);

    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    const { user } = useAuthStore();
    const currentUserId = user?._id;

    const { data: reviewsResponse } = useReviewList();
    const allReviews = reviewsResponse || [];
    const reportReview = useReportReview();

    // Filter reviews by current product ID
    const reviews = (allReviews as IReview[]).filter((review: IReview) => 
        review.productId === id
    );

    // Review pagination logic
    const reviewsPerPage = 3;
    const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);
    const startReviewIndex = (currentReviewPage - 1) * reviewsPerPage;
    const endReviewIndex = startReviewIndex + reviewsPerPage;
    const currentReviews = reviews.slice(startReviewIndex, endReviewIndex);

    const userHasReviewed = reviews.some((review: IReview) => 
        review.userId._id === currentUserId
    );

    const isReviewMode = searchParams.get('review') === 'true';
    const orderId = searchParams.get('orderId');
    const deliveryId = searchParams.get('deliveryId');

    const showAlreadyReviewedMessage = userHasReviewed && isReviewMode;
    useEffect(() => {
        if (product?.skus?.length) {
            setSelectedSku(product.skus[0]);
        }
    }, [product]);

    useEffect(() => {
        setSelectedImageIdx(0);
    }, [selectedSku]);

    if (isLoading)
        return <p className="text-center py-10">Đang tải sản phẩm...</p>;
    if (error || !product || !selectedSku)
        return (
            <p className="text-center py-10 text-red-500">
                Không tìm thấy sản phẩm.
            </p>
        );

    // Calculate final price and availability
    const finalPrice = selectedSku.discount
        ? Math.round(selectedSku.price * (1 - selectedSku.discount / 100))
        : selectedSku.price;
    const isAvailable = selectedSku.stock - selectedSku.reservedStock > 0;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Section */}
                <div>
                    <div className="relative w-full h-[400px] border rounded-lg overflow-hidden">
                        <Image
                            src={
                                selectedSku?.images?.[
                                    selectedImageIdx
                                ]?.trim() || "/placeholder.jpg"
                            }
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {selectedSku?.images?.map((img, idx) => (
                            <div
                                key={idx}
                                className={`relative w-16 h-16 border rounded-md overflow-hidden cursor-pointer ${
                                    selectedImageIdx === idx
                                        ? "border-black"
                                        : "border-gray-300"
                                }`}
                                onClick={() => setSelectedImageIdx(idx)}
                            >
                                <Image
                                    src={img?.trim() || "/assets/blank.jpg"}
                                    alt={selectedSku.variantName}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Expandable Sections */}
                    <div className="mt-6 divide-y divide-gray-200">
                        <AppSection title="Product Overview:">
                            {product.description}
                        </AppSection>
                        <AppSection title="How To Use:">
                            Thông tin đang cập nhật.
                        </AppSection>
                        <AppSection title="Add To Glance:">
                            Thông tin đang cập nhật.
                        </AppSection>
                        <AppSection title="Ingredients:">
                            {product.ingredients?.join(", ") ||
                                "Đang cập nhật..."}
                        </AppSection>
                        <AppSection title="Other Details:">
                            <p>Mã lô: {selectedSku?.batchCode}</p>
                            <p>
                                NSX: {selectedSku?.manufacturedAt?.slice(0, 10)}
                            </p>
                            <p>HSD: {selectedSku?.expiredAt?.slice(0, 10)}</p>
                            <p>
                                {selectedSku?.returnable
                                    ? "Sản phẩm hỗ trợ hoàn trả."
                                    : "Không hỗ trợ hoàn trả."}
                            </p>
                            <p>
                                {selectedSku?.internalNotes ||
                                    "Không có ghi chú."}
                            </p>
                        </AppSection>
                    </div>
                </div>
                {/* Product Info Section */}
                <div className="space-y-6 max-w-xl font-prompt text-[#000000] leading-[28px] text-[15px] capitalize">
                    {/* Tên sản phẩm + giá */}
                    <h1 className="text-[32px] leading-[44px] font-normal">
                        {product.name}
                    </h1>
                    <div className="text-[22px] leading-[34px] font-normal text-[#9F9F9F]">
                        {selectedSku?.discount ? (
                            <>
                                <span className="line-through mr-3">
                                    ₫{selectedSku.price.toLocaleString()}
                                </span>
                                <span className="text-[#c04c4c] font-semibold">
                                    ₫{finalPrice?.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="text-black font-semibold">
                                ₫{selectedSku?.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                    {/* Thông tin */}
                    <div className="space-y-1 text-[15px]">
                        <p>
                            <span className="font-semibold">Vendor:</span>{" "}
                            {product.brand}
                        </p>
                        <p>
                            <span className="font-semibold">SKU:</span>{" "}
                            {selectedSku?.batchCode}
                        </p>
                        <p>
                            <span className="font-semibold">Availability:</span>{" "}
                            <span
                                className={
                                    isAvailable
                                        ? "text-green-600"
                                        : "text-red-500"
                                }
                            >
                                {isAvailable ? "In Stock" : "Out of Stock"}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold">Tags:</span> 3 Day
                            Glow, All Products, Cream, Face, Nightcream,
                            SkinWhite, Women,
                            <br />
                            WomenFace
                        </p>
                    </div>
                    {/* SKU Selection */}
                    <div className="flex gap-2 flex-wrap mt-2">
                        {product.skus?.map((sku) => (
                            <button
                                key={sku._id}
                                onClick={() => setSelectedSku(sku)}
                                className={`px-3 py-1 border rounded-md text-sm ${
                                    selectedSku?._id === sku._id
                                        ? "border-black font-semibold"
                                        : "border-gray-300"
                                }`}
                            >
                                {sku.variantName}
                            </button>
                        ))}
                    </div>
                    {/* Divider */}
                    <hr className="my-2 border-[#000000] border-[1.2px]" />
                    {/* Quantity & Add to cart */}
                    <div className="flex items-center gap-4">
                        <div className="flex border-[1.5px] border-black h-[44px]">
                            <button
                                className="w-11 h-full flex items-center justify-center text-[18px]"
                                onClick={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                }
                            >
                                −
                            </button>
                            <span className="w-11 flex items-center justify-center text-[16px]">
                                {quantity}
                            </span>
                            <button
                                className="w-11 h-full flex items-center justify-center text-[18px]"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <AddToCartButton
                            selectedSku={selectedSku}
                            quantity={quantity}
                        />
                        <div className="border-[1.5px] border-[#CC857F] h-[44px] w-[44px] flex items-center justify-center">
                            <HeartIcon />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Đánh giá:</h3>
                {!user ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-2">🔒</div>
                        <p className="text-gray-600">Vui lòng đăng nhập để xem đánh giá về sản phẩm này</p>
                    </div>
                ) : showAlreadyReviewedMessage ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-gray-600">Bạn đã đánh giá sản phẩm này rồi</p>
                        <Button 
                            variant="outline" 
                            onClick={() => window.history.back()}
                            className="mt-4"
                        >
                            Quay lại đơn hàng
                        </Button>
                    </div>
                ) : (
                    <>
                        <ReviewCard
                            reviews={currentReviews}
                            productId={id as string}
                            orderId={orderId || undefined}
                            deliveryId={deliveryId || undefined}
                            productName={product.name}
                            onReviewCreated={() => {
                                // Invalidate and refetch reviews query
                                queryClient.invalidateQueries({ queryKey: ["reviews"] });
                            }}
                        />
                        
                        {/* Review Pagination */}
                        {totalReviewPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                onClick={() => setCurrentReviewPage(prev => Math.max(1, prev - 1))}
                                                className={currentReviewPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                        
                                        {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => setCurrentReviewPage(page)}
                                                    isActive={currentReviewPage === page}
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        
                                        <PaginationItem>
                                            <PaginationNext 
                                                onClick={() => setCurrentReviewPage(prev => Math.min(totalReviewPages, prev + 1))}
                                                className={currentReviewPage === totalReviewPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}

                <Dialog open={openReport} onOpenChange={setOpenReport}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Báo cáo</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                                                    reportReview.mutate(
                                        {
                                            id: "",
                                            reasons: selectedReasons,
                                        },
                                    {
                                        onSuccess: () => {
                                            toast.success("Report submitted");
                                            setOpenReport(false);
                                            setSelectedReasons([]);
                                        },
                                        onError: () =>
                                            toast.error("Report failed"),
                                    }
                                );
                            }}
                        >
                            <div className="space-y-2">
                                <Label>Reason(s)</Label>
                                {[
                                    "profanity",
                                    "racist",
                                    "spam",
                                    "irrelevant",
                                    "other",
                                ].map((reason) => (
                                    <div
                                        key={reason}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            id={reason}
                                            checked={selectedReasons.includes(
                                                reason
                                            )}
                                            onChange={(e) => {
                                                const checked =
                                                    e.target.checked;
                                                setSelectedReasons((prev) =>
                                                    checked
                                                        ? [...prev, reason]
                                                        : prev.filter(
                                                              (r) =>
                                                                  r !== reason
                                                          )
                                                );
                                            }}
                                        />
                                        <label
                                            htmlFor={reason}
                                            className="capitalize"
                                        >
                                            {reason}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="submit">Gửi báo cáo</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
