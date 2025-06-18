"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxBadgeProps {
  title: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function CheckboxBadge({
  title,
  checked = false,
  onCheckedChange,
}: CheckboxBadgeProps) {
  const handleClick = () => {
    onCheckedChange?.(!checked);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "px-2 rounded-full text-[14px] font-medium transition-colors",
        checked
          ? "bg-purple-600 text-white hover:bg-purple-700"
          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
      )}
    >
      {title}
    </button>
  );
}
