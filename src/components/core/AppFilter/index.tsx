// src/components/core/AppFilter.tsx
"use client";

import React, { useState } from "react";
import DynamicInput from "../AppDynamicInput";
import { Button } from "@/components/ui/button";
import { FormInputType } from "@/enum/FormInputType";
import PriceSlider from "@/components/common/priceSlider";

interface Field {
  name: string;
  fieldType: FormInputType;
  placeholder?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
}

export default function AppFilterForm({
  filterItems,
  onSubmit,
  content,
  disabled = false,
}: {
  filterItems: Field[];
  onSubmit: (values: Record<string, any>) => void;
  content: string;
  disabled?: boolean;
}) {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center flex-nowrap gap-4"
    >
      {filterItems.map((item) => {
        // TEXT / SELECT
        if (
          item.fieldType === FormInputType.TEXT ||
          item.fieldType === FormInputType.SELECT
        ) {
          return (
            <DynamicInput
              key={item.name}
              name={item.name}
              fieldType={item.fieldType}
              placeholder={item.placeholder}
              value={values[item.name] || ""}
              onChange={handleChange}
              options={item.options}
              disabled={disabled}
              className="flex-shrink-0 w-48" // cố định 192px
            />
          );
        }

        // SLIDER
        if (item.fieldType === FormInputType.SLIDER) {
          const [minVal = item.min!, maxVal = item.max!] =
            values[item.name] || [];
          return (
            <div key={item.name} className="flex-shrink-0 w-60">
              <PriceSlider
                minLimit={item.min!}
                maxLimit={item.max!}
                step={item.step!}
                minPrice={minVal}
                maxPrice={maxVal}
                onChange={([min, max]) =>
                  handleChange(item.name, [min, max])
                }
              />
            </div>
          );
        }

        return null;
      })}

      <Button
        type="submit"
        disabled={disabled}
        className="flex-shrink-0 h-10 whitespace-nowrap"
      >
        {content}
      </Button>
    </form>
  );
}
