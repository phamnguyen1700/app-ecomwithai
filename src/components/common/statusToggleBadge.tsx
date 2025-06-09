"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusToggleBadgeProps {
  initialStatus: boolean;
  onChange?: (newStatus: boolean) => void;
}

export default function StatusToggleBadge({
  initialStatus,
  onChange,
}: StatusToggleBadgeProps) {
  const [isActive, setIsActive] = useState(initialStatus);

  const handleToggle = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    onChange?.(newStatus);
  };

  const displayText = isActive ? "Đang bán" : "Ngừng bán";
  const tooltipText = isActive ? "Ngừng bán" : "Mở bán";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleToggle}
            className={cn(
              "w-[110px] text-center whitespace-nowrap",
              "px-3 text-xs font-medium rounded-full transition-colors duration-200",
              isActive
                ? "bg-green-400 text-white hover:bg-green-600"
                : "bg-red-400 text-white hover:bg-red-600"
            )}
          >
            {displayText}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
