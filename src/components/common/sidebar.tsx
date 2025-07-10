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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";

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
        icon: <Icon name="barChart" size={24} />,
        children: [
            {
                label: "Đơn hàng",
                href: "/manage/report/order",
                icon: <Icon name="listOrdered" size={20} />,
            },
            {
                label: "Vận chuyển",
                href: "/manage/report/delivery",
                icon: <Icon name="truck" size={20} />,
            },
            {
                label: "Sản phẩm báo cáo",
                href: "/manage/report/product",
                icon: <Icon name="box" size={20} />,
            },
            {
                label: "Mã giảm giá",
                href: "/manage/report/coupon",
                icon: <Icon name="badgePercent" size={20} />,
            },
            {
                label: "Địa chỉ",
                href: "/manage/report/address",
                icon: <Icon name="mapPin" size={20} />,
            },
        ],
    },
    {
        label: "Đơn hàng",
        href: "/manage/order",
        icon: <Icon name="listOrdered" size={24} />,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const renderNav = (isMobile = false) => {
        return navItems.map((item) => {
            const isActive = pathname === item.href;
            const isParentActive = item.children?.some((sub) =>
                pathname.startsWith(sub.href)
            );

            if (item.children) {
                return (
                    <Accordion
                        type="single"
                        collapsible
                        key={item.label}
                        defaultValue={isParentActive ? item.label : undefined}
                    >
                        <AccordionItem value={item.label}>
                            <AccordionTrigger className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium">
                                {item.icon}
                                {item.label}
                            </AccordionTrigger>
                            <AccordionContent className="ml-6 space-y-1">
                                {item.children.map((sub) => {
                                    const isSubActive = pathname === sub.href;
                                    return (
                                        <button
                                            key={sub.href}
                                            onClick={() => {
                                                router.push(sub.href);
                                                if (isMobile) setOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-1 rounded-md text-sm",
                                                isSubActive
                                                    ? "bg-[color:var(--tertiary)] text-white"
                                                    : "hover:bg-[color:var(--secondary)]"
                                            )}
                                        >
                                            {sub.icon}
                                            {sub.label}
                                        </button>
                                    );
                                })}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                );
            }

            return (
                <button
                    key={item.href}
                    onClick={() => {
                        router.push(item.href);
                        if (isMobile) setOpen(false);
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
        });
    };
    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[color:var(--tertiary)] text-white shadow-md"
                onClick={() => setOpen(true)}
                aria-label="Mở menu"
            >
                <Icon name="menu" size={24} />
            </button>

            <aside className="hidden lg:block w-56 h-screen bg-secondary text-[color:var(--text-color)] border-r border-muted p-4">
                <h2 className="text-xl font-bold text-[color:var(--primary)] mb-6">
                    Admin Panel
                </h2>
                <nav className="space-y-2">{renderNav()}</nav>
            </aside>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="p-0">
                    <DrawerHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
                        <DrawerTitle className="text-xl font-bold text-[color:var(--primary)]">
                            Admin Panel
                        </DrawerTitle>
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
                    <nav className="space-y-2 px-4 pb-6">{renderNav(true)}</nav>
                </DrawerContent>
            </Drawer>
        </>
    );
}
