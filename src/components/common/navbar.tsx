"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/assests/icons";
import { routesConfig } from "@/routes/config";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import LoginPage from "@/modules/login";
import { useAuthStore } from "@/zustand/store/userAuth";
import LogoutPage from "@/modules/logout";
import AppDropDown from "../core/AppDropDown";
import { useCartStore } from "@/zustand/store/cart/cartStore";
import CartProductItem from "./cartProductItem";
const user_menu = [
    { name: "Profile", route: routesConfig.profile },
    { name: "Cài đặt", route: routesConfig.settings },
    {
        component: <LogoutPage />,
    },
];
export default function Navbar() {
    // const [cartCount, setCartCount] = useState(1);
    // const [cartItems, setCartItems] = useState<any[]>([]);
    const cartItems = useCartStore((state) => state.cartItems);
    const cartCount = cartItems.reduce((acc, cur) => acc + cur.quantity, 0);
    const user = useAuthStore((state) => state.user);

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
                        <Link href={routesConfig.cart}>Cart</Link>
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
                            <div className="relative cursor-pointer">
                                <Icon name="shoppingBag" size={24} />
                                {cartCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 rounded-full"
                                    >
                                        {cartCount}
                                    </Badge>
                                )}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-2">
                                {cartItems.length === 0 ? (
                                    <div className="text-center text-xs text-gray-400 py-6">
                                        Bạn chưa mua sản phẩm nào
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <CartProductItem
                                            key={item._id}
                                            image={item.image}
                                            name={item.name}
                                            quantity={item.quantity}
                                            price={item.price}
                                        />
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Login Button */}
                    {!user && <LoginPage />}
                    {user && (
                        <div className="flx items-center space-x-2">
                            <span className="text-xs">
                                Xin chào, {user.email}
                            </span>
                            <AppDropDown
                                title={
                                    <div className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                                        <Icon name="user" size={20} />
                                    </div>
                                }
                                items={user_menu}
                            />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
