import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/assests/icons";
import { useCartQuery } from "@/tanstack/cart";
import Image from "next/image";
import { formatMoney } from "@/hooks/formatMoney";
import { useUpdateQuantityMutation, useRemoveCartItemMutation, useSelectCartItemMutation } from "@/tanstack/cart";
import { useCheckoutMutation } from "@/tanstack/checkout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useGetAddressQuery } from "@/tanstack/address";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup
} from "@/components/ui/dropdown-menu";
import { IAddress } from "@/types/address";

export default function Cart() {
    const { data: cartData, isLoading } = useCartQuery();
    const cartItems = Array.isArray(cartData?.data) ? cartData.data : [];
    const cartCount = cartItems.reduce((acc: number, cur: any) => acc + (cur.quantity || 0), 0);
    const totalPrice = cartItems
        .filter((item: any) => item.selected)
        .reduce((acc: number, item: any) => acc + (item.priceSnapshot || 0) * (item.quantity || 0), 0);
    const updateCartMutation = useUpdateQuantityMutation();
    const removeCartItemMutation = useRemoveCartItemMutation();
    const selectCartItemMutation = useSelectCartItemMutation();
    const [isBuy, setIsBuy] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const { data: addressData } = useGetAddressQuery();
    const address = addressData?.data as IAddress[];
    const checkoutMutation = useCheckoutMutation();
    const handleCheckout = () => {
        try {
            if (isBuy) {
                checkoutMutation.mutate(selectedAddressId || "");
            } else {
                setIsBuy(true);
            }
        } catch (error) {
            console.error("Checkout error:", error);
        }
    }

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
                                    <div key={skuId} className="flex items-center border-b last:border-b-0 p-2 relative hover:bg-[var(--secondary)]">
                                        <button
                                            className="absolute top-[-3px] right-[7px] z-10 cursor-pointer border-none no-underline hover:no-underline"
                                            onClick={() => removeCartItemMutation.mutate({ skuId, productId })}
                                        >
                                            <span className="text-lg">×</span>
                                        </button>
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
                                        <div className="ml-auto flex justify-end h-full items-end min-w-[100px] gap-2">
                                            <span className="text-xs font-semibold text-right">{formatMoney(priceSnapshot * quantity)}</span>
                                            <Checkbox className="w-4 h-4 rounded-none" checked={item.selected} onCheckedChange={() => selectCartItemMutation.mutate({ skuId, productId, selected: !item.selected })} />
                                        </div>
                                    </div>
                                );
                            })}
                            {isBuy && address?.length > 0 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full flex flex-col items-start gap-1 text-left px-3 py-2">
                                            {selectedAddressId ? (
                                                <>
                                                    <div className="text-xs font-medium text-stone-800 dark:text-white">
                                                        📍{address.find((addr) => addr._id === selectedAddressId)?.fullName} {address.find((addr) => addr._id === selectedAddressId)?.street}, {address.find((addr) => addr._id === selectedAddressId)?.city}...
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-sm">Chọn địa chỉ giao hàng</span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[300px]">
                                        <DropdownMenuRadioGroup
                                            value={selectedAddressId || ""}
                                            onValueChange={(val) => setSelectedAddressId(val)}
                                        >
                                            {address.map((addr: IAddress) => (
                                                <DropdownMenuRadioItem
                                                    key={addr._id}
                                                    value={addr._id}
                                                    className="!p-0"
                                                >
                                                    <div className="w-full ml-5 p-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                                                        <div className="flex flex-col text-right">
                                                            <div className="text-[14px] font-semibold text-stone-800 dark:text-stone-100">
                                                                📍 {addr.fullName}
                                                                {addr.isDefault && (
                                                                    <span className="ml-2 text-[12px] text-white bg-green-600 rounded px-1">
                                                                        Mặc định
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] text-stone-600 dark:text-stone-300 leading-snug">
                                                                {addr.street}, {addr.city}, {addr.country} ({addr.postalCode})
                                                            </div>
                                                            <div className="text-[10px] text-stone-400">{addr.phone}</div>
                                                        </div>
                                                    </div>
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>

                                </DropdownMenu>
                            )}

                            <div className="flex items-center font-semibold text-[15px] gap-2">
                                <span className="flex-1">Tổng cộng:</span>
                                <span className="text-[var(--primary)] mr-2">{totalPrice.toLocaleString()}₫</span>
                                <Button
                                    onClick={handleCheckout}
                                    disabled={isBuy && !selectedAddressId}
                                    className={cn(
                                        "bg-[var(--tertiary)] h-[35px] w-[100px] text-white text-[14px] font-bold tracking-wide rounded-none hover:bg-[var(--primary)]"
                                    )}
                                >
                                    {isBuy ? "Đặt hàng" : "Mua hàng"}
                                </Button>
                                {isBuy && (
                                    <Button
                                        className={cn(
                                            "bg-[var(--secondary)] h-[35px] w-[50px] text-black text-[14px] font-bold tracking-wide rounded-none hover:bg-[var(--tertiary)]"
                                        )}
                                        onClick={() => setIsBuy(false)}
                                    >
                                        Hủy
                                    </Button>
                                )}
                            </div>

                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
} 