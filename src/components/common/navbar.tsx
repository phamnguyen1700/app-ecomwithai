"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { routesConfig } from "@/routes/config";
import { useAuthStore } from "@/zustand/store/userAuth";
import { User } from "@/types/user";
import { toast } from "react-toastify";

import Icon from "@/components/assests/icons";
import AppDropDown from "../core/AppDropDown";
import Cart from "./Cart";
import LoginPage from "@/modules/login";
import RegisterPage from "@/modules/register";
import UserProfileDialog from "@/modules/profile_pop_up/UserProfileDialog";
import Image from "next/image";

export default function Navbar() {
  const user = useAuthStore((state) => state.user) as User | null;
  const router = useRouter();

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const handleProfileClick = () => setIsProfileDialogOpen(true);
  // const handleSettingsClick = () => router.push(routesConfig.refund);
  const handleLogout = () => {
    useAuthStore.getState().clearAuth();
    toast.success("Đã Đăng xuất!");
    router.push(routesConfig.home)
  };

  const userMenu = [
    {
      name: "Hồ sơ của bạn",
      onClick: handleProfileClick,
    },
    ...(user?.role === 'admin' ? [{
      name: "Trang quản lý",
      onClick: () => router.push("/manage/dashboard"),
    }] : []),
    {
      // name: "Yêu cầu hoàn trả",
      // onClick: handleSettingsClick,
      name: "divider",
      onClick: () => {},
    },
    {
      name: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-20 py-4 border-b border-gray-200 fixed top-0 left-10 right-0 z-50 bg-white">
        {/* Logo + Menu */}
        <div className="flex items-center gap-12">
          <Link
            href={routesConfig.home}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <Image
              src="/assets/image.png"
              alt="Logo"
              width={76}
              height={76} 
              className="object-contain rounded-full"
            />
          </Link>

          {/* Menu */}
          <ul className="flex space-x-6 text-sm font-medium">
            <li><Link href={routesConfig.home}>Trang Chủ</Link></li>
            <li><Link href={routesConfig.products}>Sản Phẩm</Link></li>
            <li><Link href={routesConfig.cart}>Giỏ Hàng</Link></li>
            <li><Link href={routesConfig.review}>Đánh giá</Link></li>
            <li><Link href={routesConfig.order}>Đơn Hàng</Link></li>
          </ul>
        </div>

        {/* Cart + Auth */}
        <div className="flex items-center">
          <Cart />
          {!user ? (
            <>
              <LoginPage />
              <RegisterPage />
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <AppDropDown
                title={
                  <div className="p-1 border-[3px] border-gray-800 rounded-full hover:bg-gray-100 cursor-pointer border border-gray-300">
                    <Icon name="user" size={20} />
                  </div>
                }
                items={userMenu}
              />
            </div>
          )}
        </div>
      </nav>

      {user && (
        <UserProfileDialog
          isOpen={isProfileDialogOpen}
          user={user}
          onClose={() => setIsProfileDialogOpen(false)}
        />
      )}
    </>
  );
}
