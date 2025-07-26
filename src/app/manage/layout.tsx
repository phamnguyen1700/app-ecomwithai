import Sidebar from "@/components/common/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";

export default function ManageLayout({ children }: { children: ReactNode }) {
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