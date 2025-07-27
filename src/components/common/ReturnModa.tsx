// components/ReturnRequestDialog.tsx
"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateReturnRequest } from "@/tanstack/return";
import Image from "next/image";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
interface ReturnRequestDialogProps {
    open: boolean;
    onClose: () => void;
    orderId: string;
}

const ReturnRequestDialog: React.FC<ReturnRequestDialogProps> = ({
    open,
    onClose,
    orderId,
}) => {
    const [reason, setReason] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const { mutate: createReturnRequest, isPending } = useCreateReturnRequest();

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
    const handleUploadImage = async (
        e: React.ChangeEvent<HTMLInputElement>
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

        setImageUrls((prev) => [...prev, ...uploadedUrls]);
    };
    const handleSubmit = () => {
        if (!reason) {
            toast.error("Vui lòng nhập lý do trả hàng.");
            return;
        }

        createReturnRequest(
            {
                orderId,
                reason,
                images: imageUrls,
            },
            {
                onSuccess: () => {
                    toast.success("Yêu cầu trả hàng đã được gửi.");
                    setReason("");
                    setImageUrls([]);
                    onClose();
                },
                onError: () => {
                    toast.error("Gửi yêu cầu thất bại.");
                },
            }
        );
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle>Yêu cầu trả hàng</DialogTitle>
                </DialogHeader>

                <Textarea
                    placeholder="Nhập lý do trả hàng..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImage}
                />

                {imageUrls.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {imageUrls.map((url, i) => (
                            <Image
                                width={50}
                                height={50}
                                key={i}
                                src={url}
                                alt={`Ảnh ${i + 1}`}
                                className="w-24 h-24 object-cover rounded border"
                            />
                        ))}
                    </div>
                )}
                <DialogFooter className="pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Huỷ
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Đang gửi..." : "Gửi yêu cầu"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReturnRequestDialog;
