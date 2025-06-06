import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/lib/QueryProvider";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryProvider>{children}</QueryProvider>
                <ToastContainer position="top-right" />
            </body>
        </html>
    );
}
