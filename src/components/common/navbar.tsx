"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/assests/icons";
import { routesConfig } from "@/routes/config";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { CART_STORAGE_KEY } from "@/constants/storageKey";
import { formatMoney } from "@/hooks/formatMoney";
import LoginPage from "@/modules/login";
import { useAuthStore } from "@/zustand/store/userAuth";
import LogoutPage from "@/modules/logout";

export default function Navbar() {
    const [cartCount, setCartCount] = useState(1); //eslint-disable-line
    const [cartItems, setCartItems] = useState<any[]>([]); //eslint-disable-line
    const user = useAuthStore((state) => state.user);
    useEffect(() => {
        //eslint-disable-line
        const updateCart = () => {
            //eslint-disable-line
            const cart = JSON.parse(
                localStorage.getItem(CART_STORAGE_KEY) || "[]"
            ); //eslint-disable-line
            setCartItems(cart); //eslint-disable-line
            setCartCount(
                cart.reduce(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (sum: number, item: any) => sum + (item.quantity || 0),
                    0
                )
            ); //eslint-disable-line
        }; //eslint-disable-line
        updateCart(); //eslint-disable-line
        window.addEventListener("cartUpdated", updateCart); //eslint-disable-line
        return () => window.removeEventListener("cartUpdated", updateCart); //eslint-disable-line
    }, []); //eslint-disable-line

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 fixed top-0 left-0 right-0 z-50 bg-white">
            {/* Logo */}
            <Link
                href={routesConfig.home}
                className="flex-none w-14 text-xl font-bold ml-4"
            >
                LOGO
            </Link>

            {/* Menu */}
            <div className="flex-initial w-1/2">
                <ul className="flex space-x-4 text-sm font-medium">
                    <li>
                        <Link href={routesConfig.home}>Trang Chủ</Link>
                    </li>
                    <li>
                        <Link href={routesConfig.products}>Sản Phẩm</Link>
                    </li>
                    <li>
                        <Link href="/accessories">Accessories</Link>
                    </li>
                    <li>
                        <Link href="/digital">Digital</Link>
                    </li>
                </ul>
            </div>

            {/* Search */}
            <div className="flex-initial w-64">
                <div className="relative flex items-center">
                    <Input
                        type="search"
                        placeholder="Search for products..."
                        className="pr-10"
                    />
                    <Icon
                        name="search"
                        size={20}
                        className="absolute right-3 text-gray-400"
                    />
                </div>
            </div>

            {/* Cart + User icons */}
            <div className="flex-none mr-5">
                <div className="flex items-center space-x-4">
                    {/* Cart Button */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <span>
                                <Button
                                    variant="ghost"
                                    className="relative p-2"
                                >
                                    <Icon name="shoppingBag" size={24} />
                                    {cartCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute -top-1 -right-1 rounded-full"
                                        >
                                            {cartCount}
                                        </Badge>
                                    )}
                                </Button>
                            </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-2">
                                {cartItems.length === 0 ? (
                                    <div className="text-center text-xs text-gray-400 py-6">
                                        Bạn chưa mua sản phẩm nào
                                    </div>
                                ) : (
                                    cartItems.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center border-b last:border-b-0 py-2"
                                        >
                                            <div className="w-14 h-14 flex-shrink-0 relative">
                                                <Image
                                                    src={
                                                        item.image ||
                                                        "/assets/blank.png"
                                                    }
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1 ml-3 flex flex-col justify-between h-full">
                                                <div className="font-medium text-xs line-clamp-1">
                                                    {item.name}
                                                </div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    Số lượng: {item.quantity}
                                                </div>
                                            </div>
                                            <div className="ml-auto flex flex-col justify-end h-full">
                                                <span className="text-xs font-semibold text-right">
                                                    {formatMoney(item.price)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Login Button */}
                    {!user && <LoginPage />}
                    {user && (
                        <div className="flex items-center space-x-2">
                            <span className="text-xs">
                                Xin chào, {user.email}
                            </span>
                            <LogoutPage />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
