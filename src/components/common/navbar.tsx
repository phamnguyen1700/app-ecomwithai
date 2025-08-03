"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { routesConfig } from "@/routes/config";
import { useAuthStore } from "@/zustand/store/userAuth";
import { User } from "@/types/user";
import { toast } from "react-toastify";
import { useDeliveriesCustomer } from "@/tanstack/delivery";
import { useAllOrderUser } from "@/tanstack/order";
import { useReviewList } from "@/tanstack/review";
import { useProducts } from "@/tanstack/product";
import { useGetAddressQuery } from "@/tanstack/address";

import Icon from "@/components/assests/icons";
import AppDropDown from "../core/AppDropDown";
import Cart from "./Cart";
import UserProfileDialog from "@/modules/profile_pop_up/UserProfileDialog";
import Image from "next/image";
import LoginPage from "@/modules/login";
import ReviewDialog from "@/modules/review/reviewComponents/reviewDialog";
import { IReview } from "@/types/review";

export default function Navbar() {
  const user = useAuthStore((state) => state.user) as User | null;
  const router = useRouter();

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Fetch data for review dialog
  const { data: allDeliveries, isLoading: isLoadingDeliveries } = useDeliveriesCustomer({
    limit: 999,
    status: "delivered",
  });
  const { data: orders = [] } = useAllOrderUser({ limit: 999 });
  const { data: reviewsResponse } = useReviewList();
  const { data: products } = useProducts();
  
  // Fetch addresses for user profile dialog
  const { data: addresses = [], refetch: refetchAddresses } = useGetAddressQuery();

  console.log(addresses)

  // Filter deliveries for current user
  const deliveriesData = allDeliveries?.data?.filter((delivery: any) =>
    delivery.customerId === user?._id
  ) || [];

  // Extract reviews data from response
  const reviewsData = reviewsResponse || [];

  const handleProfileClick = () => setIsProfileDialogOpen(true);
  const handleReviewClick = () => setIsReviewDialogOpen(true);
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
    {
      name: "Xem Đánh giá",
      onClick: handleReviewClick,
    },
    ...(user?.role === 'admin' ? [{
      name: "Trang quản lý",
      onClick: () => router.push("/manage/dashboard"),
    }] : []),
    {
      // name: "Yêu cầu hoàn trả",
      // onClick: handleSettingsClick,
      name: "divider",
      onClick: () => { },
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
            {user && (
              <li><Link href={routesConfig.order}>Đơn Hàng</Link></li>
            )}
          </ul>
        </div>

        {/* Cart + Auth */}
        <div className="flex items-center">
          {user && <Cart />}
          {!user ? (
            <div className="relative">
              <div
                className="p-1 border-[3px] border-gray-800 rounded-full hover:bg-gray-100 cursor-pointer border border-gray-300"
                onClick={() => {
                  const loginButton = document.querySelector('[data-login-trigger]') as HTMLButtonElement;
                  if (loginButton) {
                    loginButton.click();
                  }
                }}
              >
                <Icon name="user" size={20} />
              </div>

            </div>
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
          addresses={addresses}
          refetchAddresses={refetchAddresses}
        />
      )}

      {/* Hidden LoginPage for authentication */}
      {!user && <LoginPage />}

      {/* Review Dialog */}
      {user && (
        <ReviewDialog
          open={isReviewDialogOpen}
          onClose={() => setIsReviewDialogOpen(false)}
          userId={user._id}
          deliveriesData={deliveriesData}
          ordersData={orders?.data || []}
          productsData={products?.data || []}
          reviewsData={reviewsData as IReview[]}
          isLoadingDeliveries={isLoadingDeliveries}
        />
      )}
    </>
  );
}
