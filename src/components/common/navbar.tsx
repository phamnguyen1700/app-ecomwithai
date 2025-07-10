"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { routesConfig } from "@/routes/config";
import { useAuthStore } from "@/zustand/store/userAuth";
import { User } from "@/types/user";

import Icon from "@/components/assests/icons";
import AppDropDown from "../core/AppDropDown";
import Cart from "./Cart";
import LoginPage from "@/modules/login";
import RegisterPage from "@/modules/register";
import LogoutPage from "@/modules/logout";
import UserProfileDialog from "@/modules/profile_pop_up/UserProfileDialog";

export default function Navbar() {
  const user = useAuthStore((state) => state.user) as User | null;
  const router = useRouter();

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const handleProfileClick = () => setIsProfileDialogOpen(true);
  const handleSettingsClick = () => router.push(routesConfig.settings);

  const userMenu = [
    {
      name: "Profile",
      onClick: handleProfileClick,
    },
    {
      name: "Cài đặt",
      onClick: handleSettingsClick,
    },
    {
      component: <LogoutPage />,
    },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 fixed top-0 left-0 right-0 z-50 bg-white">
        {/* Logo */}
        <Link
          href={routesConfig.home}
          className="flex-none w-14 text-xl font-bold ml-4"
        >
          LOGO
        </Link>

        {/* Menu */}
        <div className="flex-initial w-1/3">
          <ul className="flex space-x-4 text-sm font-medium">
            <li><Link href={routesConfig.home}>Trang Chủ</Link></li>
            <li><Link href={routesConfig.products}>Sản Phẩm</Link></li>
            <li><Link href={routesConfig.cart}>Giỏ Hàng</Link></li>
            <li><Link href="/digital">Digital</Link></li>
          </ul>
        </div>

        {/* Cart + Auth */}
        <div className="flex-none mr-5">
          <div className="flex items-center space-x-4">
            <Cart />
            {!user ? (
              <>
                <LoginPage />
                <RegisterPage />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xs">Xin chào, {user.email || "user"}</span>
                <AppDropDown
                  title={
                    <div className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                      <Icon name="user" size={20} />
                    </div>
                  }
                  items={userMenu}
                />
              </div>
            )}
          </div>
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
