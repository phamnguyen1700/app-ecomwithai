import { ChevronDown } from "lucide-react";
import { useState } from "react";

function AppSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-300">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center py-4 text-sm font-medium text-left"
            >
                <span>{title}</span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                        open ? "rotate-180" : "rotate-0"
                    }`}
                />
            </button>
            {open && (
                <div className="pb-4 text-sm text-gray-500">{children}</div>
            )}
        </div>
    );
}
export default AppSection;
