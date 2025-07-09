"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Icon from "@/components/assests/icons";
import { routesConfig } from "@/routes/config";
import LoginPage from "@/modules/login";
import LogoutPage from "@/modules/logout";
import AppDropDown from "../core/AppDropDown";
import Cart from "./Cart";
import UserProfileDialog from "@/modules/profile_pop_up/UserProfileDialog";
import { useAuthStore } from "@/zustand/store/userAuth";
import { User } from "@/types/user";

export default function Navbar() {
  const user = useAuthStore((state) => state.user) as User;
  const router = useRouter();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const user_menu = [
    {
      name: "Profile",
      onClick: () => {
        setSelectedUser(user);
        setIsProfileDialogOpen(true);
      },
    },
    {
      name: "Cài đặt",
      onClick: () => router.push(routesConfig.settings),
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
            <Cart />
            {!user && <LoginPage />}
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-xs">Xin chào, {user.email}</span>
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

      {/* User Profile Dialog */}
      {selectedUser && (
        <UserProfileDialog
          key={selectedUser._id} // 👉 ép component render lại nếu user khác
          user={selectedUser}
          isOpen={isProfileDialogOpen}
          onClose={() => setIsProfileDialogOpen(false)}
        />
      )} </>

  )}