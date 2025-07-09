"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

// ✅ Track màu đen không chia màu
const sliderTrackVariants = cva(
  "relative w-full grow overflow-hidden rounded-full bg-black",
  {
    variants: {
      size: {
        base: "h-0.5",
        medium: "h-1.5",
        large: "h-2",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
);

// ✅ Thumb (nút trượt) nhỏ hơn, màu đen, viền trắng
const sliderThumbVariants = cva(
  "block border border-black bg-white rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        base: "h-3 w-3",
        medium: "h-4 w-4",
        large: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
);

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> &
  VariantProps<typeof sliderTrackVariants> & {
    range?: boolean; // ✅ Bật/Tắt chế độ range slider
  };

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, size, range = false, ...props }, ref) => { // eslint-disable-line
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      {/* Thanh trượt màu đen */}
      <SliderPrimitive.Track className={cn(sliderTrackVariants({ size }))}>
        <SliderPrimitive.Range className="absolute h-full bg-black" />
      </SliderPrimitive.Track>

      {/* Nút trượt nhỏ hơn, màu đen, viền trắng */}
      {(props.value ?? props.defaultValue)?.map((_, index) => (
        <SliderPrimitive.Thumb key={index} className={cn(sliderThumbVariants({ size }))} />
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
