"use client";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/hooks/formatMoney";
import React from "react";
import {
    useCartQuery,
    useUpdateQuantityMutation,
    useRemoveCartItemMutation,
} from "@/tanstack/cart";
import Image from "next/image";
import Icon from "@/components/assests/icons";
import { useGetAddressQuery } from "@/tanstack/address";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { useCheckoutMutation } from "@/tanstack/checkout";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Cart() {
    const { data: cartData, isLoading } = useCartQuery();
    const updateCartMutation = useUpdateQuantityMutation();
    const removeCartItemMutation = useRemoveCartItemMutation();
    const cartItems = Array.isArray(cartData?.data) ? cartData.data : [];

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        null
    );
    const { data: addressData } = useGetAddressQuery();
    const checkoutMutation = useCheckoutMutation();

    if (isLoading) {
        return (
            <div className="text-center py-20 text-gray-500 text-sm">
                Đang tải giỏ hàng...
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 text-sm">
                Giỏ hàng của bạn đang trống.
            </div>
        );
    }
    const handleCheckout = () => {
        if (!selectedAddressId) {
            toast.error("Vui lòng chọn địa chỉ giao hàng");
            return;
        }

        checkoutMutation.mutate(selectedAddressId, {
            onSuccess: () => toast.success("Đặt hàng thành công!"),
            onError: () => toast.error("Đặt hàng thất bại"),
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-2xl font-semibold">Giỏ hàng</h1>

            <div className="space-y-4">
                {cartItems.map((item: any) => {
                    const {
                        skuId,
                        productId,
                        image,
                        skuName,
                        quantity,
                        priceSnapshot,
                    } = item;
                    return (
                        <div
                            key={skuId}
                            className="flex items-center justify-between border p-4 rounded-md"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 relative">
                                    <Image
                                        src={image || "/assets/blank.jpg"}
                                        alt={skuName}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-sm line-clamp-1">
                                        {skuName}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Đơn giá: {formatMoney(priceSnapshot)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() =>
                                        updateCartMutation.mutate({
                                            skuId,
                                            productId,
                                            quantity: Math.max(1, quantity - 1),
                                        })
                                    }
                                    className="w-8 h-8 border rounded"
                                    disabled={quantity <= 1}
                                >
                                    −
                                </Button>
                                <span className="w-6 text-center">
                                    {quantity}
                                </span>
                                <Button
                                    onClick={() =>
                                        updateCartMutation.mutate({
                                            skuId,
                                            productId,
                                            quantity: quantity + 1,
                                        })
                                    }
                                    className="w-8 h-8 border rounded"
                                >
                                    +
                                </Button>
                            </div>
                            <div className="ml-4 min-w-[100px] text-right font-semibold">
                                {formatMoney(priceSnapshot * quantity)}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    removeCartItemMutation.mutate({
                                        skuId,
                                        productId,
                                    })
                                }
                            >
                                <Icon
                                    name="trash"
                                    className="w-4 h-4 text-red-500"
                                />
                            </Button>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-6 border-t">
                <div className="text-lg font-semibold">
                    Tổng cộng:{" "}
                    {formatMoney(
                        cartItems.reduce(
                            (sum: number, item: any) =>
                                sum +
                                (item.priceSnapshot || 0) *
                                    (item.quantity || 0),
                            0
                        )
                    )}
                </div>
            </div>
            <div className="pt-6 flex flex-col gap-3 border-t">
                {addressData && addressData.length > 0 ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full text-left justify-start"
                            >
                                {selectedAddressId ? (
                                    <>
                                        📍{" "}
                                        {
                                            addressData.find(
                                                (addr) =>
                                                    addr._id ===
                                                    selectedAddressId
                                            )?.fullName
                                        }
                                        ,{" "}
                                        {
                                            addressData.find(
                                                (addr) =>
                                                    addr._id ===
                                                    selectedAddressId
                                            )?.street
                                        }
                                        ,{" "}
                                        {
                                            addressData.find(
                                                (addr) =>
                                                    addr._id ===
                                                    selectedAddressId
                                            )?.city
                                        }
                                    </>
                                ) : (
                                    "Chọn địa chỉ giao hàng"
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                            <DropdownMenuRadioGroup
                                value={selectedAddressId || ""}
                                onValueChange={(val) =>
                                    setSelectedAddressId(val)
                                }
                            >
                                {addressData.map((addr) => (
                                    <DropdownMenuRadioItem
                                        key={addr._id}
                                        value={addr._id}
                                    >
                                        {addr.fullName} - {addr.street},{" "}
                                        {addr.city}
                                        {addr.isDefault && (
                                            <span className="ml-2 text-xs text-green-600">
                                                (Mặc định)
                                            </span>
                                        )}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <p className="text-sm text-gray-500">
                        Không có địa chỉ. Vui lòng thêm trong hồ sơ.
                    </p>
                )}

                <Button
                    className="bg-[var(--primary)] text-white font-bold tracking-wide"
                    disabled={!selectedAddressId || cartItems.length === 0}
                    onClick={handleCheckout}
                >
                    Đặt hàng
                </Button>
            </div>
        </div>
    );
}
