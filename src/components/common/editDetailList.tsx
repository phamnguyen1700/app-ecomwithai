"use client";

import { useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditDetailListProps {
  value: string[];
  onChange?: (updatedList: string[]) => void;
}

export default function EditDetailList({ value, onChange }: EditDetailListProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const newValue = inputValue.trim();
    if (newValue && !value.includes(newValue)) {
      onChange?.([...value, newValue]);
    }
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRemove = (item: string) => {
    onChange?.(value.filter((v) => v !== item));
  };

  return (
    <div className="flex py-1 gap-4 items-start">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className="ml-2 p-1 rounded hover:bg-muted"
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setPopoverOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            <Plus className="w-3 h-3 text-muted-foreground hover:text-black" />
          </button>
        </PopoverTrigger>
        <PopoverContent className={cn(
          "bg-white shadow-lg p-3 w-[260px] rounded-md border",
          "flex flex-col gap-2"
        )}>
          <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
            {value.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {item}
                <button
                  onClick={() => handleRemove(item)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="h-8"
            />
            <Button size="sm" className="bg-[color:var(--tertiary)] hover:bg-red-300" onClick={handleAdd}>
              Thêm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
