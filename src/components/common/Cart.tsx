import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Icon from "@/components/assests/icons";
import { useCartQuery } from "@/tanstack/cart";
import Image from "next/image";
import { formatMoney } from "@/hooks/formatMoney";
import { useUpdateQuantityMutation, useRemoveCartItemMutation } from "@/tanstack/cart";
import { Button } from "@/components/ui/button";

export default function Cart() {
    const { data: cartData, isLoading } = useCartQuery();
    const cartItems = Array.isArray(cartData?.data) ? cartData.data : [];
    const cartCount = cartItems.reduce((acc: number, cur: any) => acc + (cur.quantity || 0), 0);
    const totalPrice = cartItems.reduce((acc: number, item: any) => acc + (item.priceSnapshot || 0) * (item.quantity || 0), 0);
    const updateCartMutation = useUpdateQuantityMutation();
    const removeCartItemMutation = useRemoveCartItemMutation();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                    <Icon name="shoppingBag" size={24} />
                    {cartCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center text-xs leading-none"
                        >
                            {cartCount}
                        </Badge>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-2">
                    {isLoading ? (
                        <div className="text-center text-xs text-gray-400 py-6">
                            Đang tải...
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="text-center text-xs text-gray-400 py-6">
                            Bạn chưa mua sản phẩm nào
                        </div>
                    ) : (
                        <>
                            {cartItems.map((item: any) => {
                                const {
                                    skuId,
                                    productId,
                                    image,
                                    skuName,
                                    quantity,
                                    priceSnapshot
                                } = item;
                                return (
                                        <div key={skuId} className="flex items-center border-b last:border-b-0 py-2 relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-[-10px] right-[-20px] z-10"
                                                onClick={() => removeCartItemMutation.mutate({ skuId, productId })}
                                            >
                                                <span className="text-lg text-red-500">×</span>
                                            </Button>
                                            <div className="w-14 h-14 flex-shrink-0 relative">
                                                <Image src={image || '/assets/blank.png'} alt={skuName} fill className="object-cover rounded" />
                                            </div>
                                            <div className="flex-1 ml-3 flex flex-col justify-between h-full">
                                                <div className="font-medium text-xs line-clamp-1">{skuName}</div>
                                                <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-2 border rounded text-xs w-4 h-4 bg-white text-black border-none"
                                                        onClick={() => updateCartMutation.mutate({ skuId, productId, quantity: Math.max(1, quantity - 1) })}
                                                        disabled={quantity <= 1}
                                                    >-</Button>
                                                    <span className="px-2 text-black font-bold">{quantity}</span>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-2 border rounded text-xs w-4 h-4 bg-white text-black border-none"
                                                        onClick={() => updateCartMutation.mutate({ skuId, productId, quantity: quantity + 1 })}
                                                    >+</Button>
                                                </div>
                                            </div>
                                            <div className="ml-auto flex flex-col justify-end h-full items-end min-w-[100px]">
                                                <span className="text-xs font-semibold text-right">{formatMoney(priceSnapshot * quantity)}</span>
                                            </div>
                                        </div>
                                );
                            })}
                            <div className="flex justify-between items-center mt-2 font-semibold text-base">
                                <span>Tổng cộng:</span>
                                <span className="text-[var(--primary)]">₫{totalPrice.toLocaleString()}</span>
                            </div>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
} 