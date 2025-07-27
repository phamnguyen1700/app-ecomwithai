"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDeliveriesCustomer } from "@/tanstack/delivery";
import { useAllOrderUser } from "@/tanstack/order";
import {
    useCreateReview,
    useReviewList,
    useUpdateReview,
} from "@/tanstack/review";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
const ReviewPage = () => {
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        comment: "",
        rating: 5,
        productId: "",
        orderId: "",
        deliveryId: "",
    });
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [editImageUrls, setEditImageUrls] = useState<string[]>([]);

    const createReview = useCreateReview();
    const updateReview = useUpdateReview();
    const { data: reviews = [] } = useReviewList();
    const { data: orders = [] } = useAllOrderUser({ limit: 999 });
    const { data: deliveriesData } = useDeliveriesCustomer({
        page: currentPage,
        limit: 5,
        status: "delivered",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createReview.mutate(
            { ...formData, images: imageUrls },
            {
                onSuccess: () => {
                    toast.success("Review submitted successfully!");
                    setFormData({
                        comment: "",
                        rating: 5,
                        productId: "",
                        orderId: "",
                        deliveryId: "",
                    });
                    setImageUrls([]);
                    setOpen(false);
                },
                onError: () => toast.error("Failed to submit review."),
            }
        );
    };

    const handleUploadImage = async (
        e: React.ChangeEvent<HTMLInputElement>,
        isEdit = false
    ) => {
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

        if (isEdit) setEditImageUrls((prev) => [...prev, ...uploadedUrls]);
        else setImageUrls((prev) => [...prev, ...uploadedUrls]);
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

    const [openEdit, setOpenEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        id: "",
        comment: "",
        rating: 5,
    });
    
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 mt-10">
                Delivered Products
            </h2>

            {deliveriesData?.data?.map((delivery: any) => {
                const matchedOrder = orders?.data?.find(
                    (o: any) => o._id === delivery.orderId
                );
                const product = matchedOrder?.items?.[0]; // Lấy sản phẩm đầu tiên

                return (
                    <Card key={delivery._id} className="mb-4">
                        <CardContent className="p-4 space-y-2">
                            <p>
                                <strong>Order ID:</strong> {delivery.orderId}
                            </p>
                            <p>
                                <strong>Tracking:</strong>{" "}
                                {delivery.trackingNumber}
                            </p>
                            <p>
                                <strong>Delivered at:</strong>{" "}
                                {new Date(
                                    delivery.deliveryDate
                                ).toLocaleString()}
                            </p>

                            {product && (
                                <div className="space-y-1">
                                    <p>
                                        <strong>Product:</strong>{" "}
                                        {product.skuName}
                                    </p>
                                    <p>
                                        <strong>Quantity:</strong>{" "}
                                        {product.quantity}
                                    </p>
                                    <p>
                                        <strong>Price:</strong>{" "}
                                        {product.priceSnapshot.toLocaleString()}
                                        ₫
                                    </p>
                                    <Image
                                        width={50}
                                        height={50}
                                        src={product.image}
                                        alt="product"
                                        className="w-24 h-24 rounded-md object-cover border"
                                    />
                                </div>
                            )}

                            <Button
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        orderId: delivery.orderId,
                                        deliveryId: delivery._id,
                                        productId: product?.productId || "",
                                    });
                                    setOpen(true);
                                }}
                            >
                                Write a Review
                            </Button>
                        </CardContent>
                    </Card>
                );
            })}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Your Review</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Rating</Label>
                            <Select
                                value={formData.rating.toString()}
                                onValueChange={(val) =>
                                    setFormData({
                                        ...formData,
                                        rating: Number(val),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 4, 3, 2, 1].map((r) => (
                                        <SelectItem
                                            key={r}
                                            value={r.toString()}
                                        >
                                            {r} Stars
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <input
                            type="hidden"
                            name="orderId"
                            value={formData.orderId}
                        />
                        <input
                            type="hidden"
                            name="deliveryId"
                            value={formData.deliveryId}
                        />
                        <input
                            type="hidden"
                            name="productId"
                            value={formData.productId}
                        />
                        <div>
                            <Label htmlFor="images">Upload Images</Label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleUploadImage}
                                className="mt-2"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {imageUrls.map((url, idx) => (
                                    <Image
                                        key={idx}
                                        src={url}
                                        alt={`uploaded-${idx}`}
                                        width={80}
                                        height={80}
                                        className="rounded-md border"
                                    />
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={createReview.isPending}
                            >
                                {createReview.isPending
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    Previous
                </Button>
                <span>
                    Page {deliveriesData?.meta?.currentPage || 1} /{" "}
                    {deliveriesData?.meta?.totalPages || 1}
                </span>
                <Button
                    variant="outline"
                    disabled={
                        currentPage >= (deliveriesData?.meta?.totalPages || 1)
                    }
                    onClick={() => setCurrentPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
            <Card className="mt-6">
                <CardContent className="p-4 space-y-2">
                    <h3 className="text-xl font-semibold">
                        My Submitted Reviews
                    </h3>
                    {reviews.length === 0 ? (
                        <p className="text-muted-foreground">No reviews yet.</p>
                    ) : (
                        reviews.map((review: any) => {
                            const matchedOrder = orders?.data?.find(
                                (o: any) => o._id === review.orderId
                            );
                            const product = matchedOrder?.items?.find(
                                (item: any) =>
                                    item.productId === review.productId
                            );

                            return (
                                <div
                                    key={review._id}
                                    className="p-3 border rounded-md space-y-2"
                                >
                                    <div className="flex items-center space-x-4">
                                        {product && (
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <p className="font-semibold">
                                                        {product.skuName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Quantity:{" "}
                                                        {product.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {review.images?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {review.images.map(
                                                    (
                                                        url: string,
                                                        idx: number
                                                    ) => (
                                                        <Image
                                                            key={idx}
                                                            src={url}
                                                            alt={`review-${idx}`}
                                                            width={80}
                                                            height={80}
                                                            className="rounded-md border"
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p>
                                        <strong>Rating:</strong> {review.rating}{" "}
                                        ⭐
                                    </p>
                                    <p>
                                        <strong>Comment:</strong>{" "}
                                        {review.comment}
                                    </p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditForm({
                                                id: review._id,
                                                comment: review.comment,
                                                rating: review.rating,
                                            });
                                            setOpenEdit(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <p className="text-sm text-gray-500">
                                        Submitted at:{" "}
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Review</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateReview.mutate(
                                {
                                    id: editForm.id,
                                    data: {
                                        rating: editForm.rating,
                                        comment: editForm.comment,
                                        images: editImageUrls,
                                    },
                                },
                                {
                                    onSuccess: () => {
                                        toast.success("Review updated!");
                                        setImageUrls([]);
                                        setOpenEdit(false);
                                    },
                                    onError: () =>
                                        toast.error("Update failed."),
                                }
                            );
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <Label>Rating</Label>
                            <Select
                                value={editForm.rating.toString()}
                                onValueChange={(val) =>
                                    setEditForm({
                                        ...editForm,
                                        rating: Number(val),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 4, 3, 2, 1].map((r) => (
                                        <SelectItem
                                            key={r}
                                            value={r.toString()}
                                        >
                                            {r} Stars
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                name="comment"
                                value={editForm.comment}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        comment: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-images">Upload Images</Label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleUploadImage(e, true)}
                                className="mt-2"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {editImageUrls.map((url, idx) => (
                                    <Image
                                        key={idx}
                                        src={url}
                                        alt={`edit-upload-${idx}`}
                                        width={80}
                                        height={80}
                                        className="rounded-md border"
                                    />
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={updateReview.isPending}
                            >
                                {updateReview.isPending
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReviewPage;
