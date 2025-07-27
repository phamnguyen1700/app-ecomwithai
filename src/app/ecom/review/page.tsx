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
import { useCreateReview, useReviewList } from "@/tanstack/review";
import React, { useState } from "react";

const REviewPage = () => {
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        comment: "",
        rating: "5",
        productId: "",
        orderId: "",
        deliveryId: "",
    });

    const createReview = useCreateReview();
    const { data: reviews = [], isFetching } = useReviewList({ limit: 9999 });
    const { data: deliveriesData, isLoading } = useDeliveriesCustomer({
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
        createReview.mutate(formData, {
            onSuccess: () => {
                alert("Review submitted successfully");
                setFormData({
                    comment: "",
                    rating: "5",
                    productId: "",
                    orderId: "",
                    deliveryId: "",
                });
                setOpen(false);
            },
            onError: () => alert("Failed to submit review"),
        });
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 mt-10">
                Delivered Products
            </h2>

            {isLoading ? (
                <p>Loading deliveries...</p>
            ) : (
                deliveriesData?.data?.map((delivery: any) => (
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
                            <Button
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        orderId: delivery.orderId,
                                        deliveryId: delivery._id,
                                        productId: "", // Nếu có thể lấy productId từ delivery thì gắn luôn
                                    });
                                    setOpen(true);
                                }}
                            >
                                Write a Review
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Your Review</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Rating</Label>
                            <Select
                                value={formData.rating}
                                onValueChange={(val) =>
                                    setFormData({ ...formData, rating: val })
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
            <Card className="mt-6">
                <CardContent className="p-4 space-y-2">
                    <h3 className="text-xl font-semibold">
                        My Submitted Reviews
                    </h3>
                    {isFetching ? (
                        <p>Loading...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-muted-foreground">No reviews yet.</p>
                    ) : (
                        reviews.map((review: any) => (
                            <div
                                key={review.id}
                                className="p-3 border rounded-md"
                            >
                                <p>
                                    <strong>Rating:</strong> {review.rating} ⭐
                                </p>
                                <p>
                                    <strong>Comment:</strong> {review.comment}
                                </p>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
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
                        reviews.map((review: any) => (
                            <div
                                key={review.id}
                                className="p-3 border rounded-md"
                            >
                                <p>
                                    <strong>Rating:</strong> {review.rating} ⭐
                                </p>
                                <p>
                                    <strong>Comment:</strong> {review.comment}
                                </p>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default REviewPage;
