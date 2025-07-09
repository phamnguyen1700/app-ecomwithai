"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface PriceSliderProps {
  minPrice?: number;
  maxPrice?: number;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
  onChange: (values: [number, number]) => void;
}

export default function PriceSlider({
  minPrice = 0,
  maxPrice = 2000000,
  minLimit = 0,
  maxLimit = 2000000,
  step = 10000,
  onChange,
}: PriceSliderProps) {
  const [values, setValues] = useState<[number, number]>([minPrice, maxPrice]);

  const handleChange = (newValues: [number, number]) => {
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="flex flex-col gap-2 w-full text-center">
      {/* Hiển thị giá trị trên slider */}
      <span className="text-sm font-medium">
        {values[0].toLocaleString()}₫ - {values[1].toLocaleString()}₫
      </span>

      {/* Thanh slider */}
      <div className="relative w-full flex items-center">
        <Slider
          min={minLimit}
          max={maxLimit}
          step={step}
          defaultValue={values}
          onValueChange={(value) => handleChange(value as [number, number])}
          className="w-full"
          range
          size="base"
        />
      </div>
    </div>
  );
}


