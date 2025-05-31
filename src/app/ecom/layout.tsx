import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/common/navbar";
import "@/app/globals.css";
import CommerceGPT from "@/components/common/commerce-gpt";

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
            <head />
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Navbar />
                <div className="mt-[69px] container">
                    {children}
                </div>
                <CommerceGPT />
            </body>
        </html>
    );
}
