import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/common/navbar";
import "@/app/globals.css";
import CommerceGPT from "@/components/common/commerce-gpt";
import Footer from "@/components/common/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function PaymentLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <html lang="en">
            <head />
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Navbar />
                <div className="mt-[69px] container mx-auto">{children}</div>
                <Footer />
                <CommerceGPT />
            </body>
        </html>
    );
  }
  
