import "@/app/globals.css";
import Sidebar from "@/components/common/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

export const metadata = {
    title: "Trang quản trị",
    description: "Quản lý nội dung và đánh giá",
};

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <TooltipProvider>
                    <div className="flex min-h-screen">
                        <Sidebar />
                        <main className="flex-1 bg-background text-foreground p-6 overflow-auto">
                            {children}
                        </main>
                    </div>
                </TooltipProvider>
            </body>
        </html>
    );
}
