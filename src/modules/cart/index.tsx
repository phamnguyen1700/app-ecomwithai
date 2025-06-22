'use client'
import CartProductItem from "@/components/common/cartProductItem";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/hooks/formatMoney";
import { useCartStore } from "@/zustand/store/cart/cartStore";
import { Trash2 } from "lucide-react";
import React from "react";

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity } = useCartStore();

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 text-sm">
                Giỏ hàng của bạn đang trống.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-2xl font-semibold">Giỏ hàng</h1>

            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div
                        key={item._id}
                        className="flex items-center justify-between border p-4 rounded-md"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <CartProductItem
                                image={item.image}
                                name={item.name}
                                quantity={item.quantity}
                                price={item.price}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() =>
                                    updateQuantity(
                                        item._id,
                                        Math.max(1, item.quantity - 1)
                                    )
                                }
                                className="w-8 h-8 border rounded"
                            >
                                −
                            </Button>
                            <span className="w-6 text-center">
                                {item.quantity}
                            </span>
                            <Button
                                onClick={() =>
                                    updateQuantity(item._id, item.quantity + 1)
                                }
                                className="w-8 h-8 border rounded"
                            >
                                +
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item._id)}
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-6 border-t">
                <div className="text-lg font-semibold">
                    Tổng cộng:{" "}
                    {formatMoney(
                        cartItems.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
