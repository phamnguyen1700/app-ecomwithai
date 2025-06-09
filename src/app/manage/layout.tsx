import { Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "@/components/common/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";


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
        <TooltipProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 bg-background text-foreground p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </TooltipProvider>
    );
}
