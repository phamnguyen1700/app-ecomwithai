"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditDetailListProps {
  initialValues: string[];
  onChange?: (updatedList: string[]) => void;
}

export default function EditDetailList({
  initialValues,
  onChange,
}: EditDetailListProps) {
  const [values, setValues] = useState<string[]>(initialValues || []);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const newValue = inputValue.trim();
    if (newValue && !values.includes(newValue)) {
      const updated = [...values, newValue];
      setValues(updated);
      onChange?.(updated);
    }
    setInputValue("");
  };

  const handleRemove = (item: string) => {
    const updated = values.filter((v) => v !== item);
    setValues(updated);
    onChange?.(updated);
  };

  return (
    <div className="flex py-1 gap-4 items-start">
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
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
          >
            <Plus className="w-3 h-3 text-muted-foreground hover:text-black" />
          </button>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          className={cn(
            "bg-white shadow-lg p-3 w-[260px] rounded-md border",
            "flex flex-col gap-2"
          )}
        >
          <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
            {values.map((item) => (
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="h-8"
            />
            <Button size="icon" onClick={handleAdd}>
              +
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
