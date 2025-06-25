"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Icon from "@/components/assests/icons";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

const navItems = [
  {
    label: "Tổng quan",
    href: "/manage/dashboard",
    icon: <Icon name="home" size={24} />,
  },
  {
    label: "Sản phẩm",
    href: "/manage/product",
    icon: <Icon name="package" size={24} />,
  },
  {
    label: "Báo cáo",
    href: "/manage/report",
    icon: <Icon name="barChart" size={24} />,
  },
  {
    label: "Đơn hàng",
    href: "/manage/order",
    icon: <Icon name="listOrdered" size={24} />,
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Drawer button for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[color:var(--tertiary)] text-white shadow-md"
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
      >
        <Icon name="menu" size={24} />
      </button>

      {/* Sidebar for desktop */}
      <aside className="hidden lg:block w-56 h-screen bg-secondary text-[color:var(--text-color)] border-r border-muted p-4">
        <h2 className="text-xl font-bold text-[color:var(--primary)] mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-[color:var(--tertiary)] text-white"
                    : "hover:bg-[color:var(--secondary)]"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Drawer for mobile */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-0">
          <DrawerHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
            <DrawerTitle className="text-xl font-bold text-[color:var(--primary)]">Admin Panel</DrawerTitle>
            <DrawerClose asChild>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Đóng menu"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </DrawerClose>
          </DrawerHeader>
          <nav className="space-y-2 px-4 pb-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
                    isActive
                      ? "bg-[color:var(--tertiary)] text-white"
                      : "hover:bg-[color:var(--secondary)]"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  );
}
