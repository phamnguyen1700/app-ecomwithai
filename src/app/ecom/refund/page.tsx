"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectItem,
    SelectValue,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAllOrderUser } from "@/tanstack/order";
import { useRefundRequest } from "@/tanstack/refund";
import React, { useState } from "react";

const RefundPage = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        orderId: "",
        amount: "",
        reason: "",
    });
    const { data: OrderData } = useAllOrderUser({ limit: 9999 });

    const refundMutation = useRefundRequest();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        refundMutation.mutate(
            {
                orderId: formData.orderId,
                amount: Number(formData.amount),
                reason: formData.reason,
            },
            {
                onSuccess: () => {
                    alert("Refund request submitted!");
                },
                onError: () => {
                    alert("Failed to submit refund request");
                },
            }
        );
    };

    return (
        <div className="p-4 space-y-6 max-w-3xl mx-auto pt-10">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full">+ Create Refund Request</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Refund</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="orderId">Order ID</Label>
                            <Select
                                onValueChange={(val) =>
                                    setFormData({ ...formData, orderId: val })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a shipped order" />
                                </SelectTrigger>
                                <SelectContent>
                                    {OrderData?.data?.filter(
                                        (order: any) => order.orderStatus === "Delivered"
                                    ).map((order: any) => (
                                        <SelectItem
                                            key={order.id}
                                            value={order.id}
                                        >
                                            {order.id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="amount">Amount (in cents)</Label>
                            <Input
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={refundMutation.isPending}
                            >
                                {refundMutation.isPending
                                    ? "Submitting..."
                                    : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card>
                <CardContent className="p-4 space-y-2">
                    <h3 className="text-xl font-semibold">
                        My Refund Requests
                    </h3>
                    <div className="text-muted-foreground">
                        (This area will show the refund list)
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RefundPage;
