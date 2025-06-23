"use client";

import { Button } from "@/components/ui/button";
import { ISku } from "@/types/product";
import { CART_STORAGE_KEY } from "@/constants/storageKey";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  selectedSku: ISku;
  quantity: number;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  selectedSku,
  quantity,
}) => {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

    const existingIndex = cart.findIndex(
      (item: { skuId: string }) => item.skuId === selectedSku._id
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        skuId: selectedSku._id,
        productId: selectedSku.productId,
        name: selectedSku.variantName,
        image: selectedSku.image,
        quantity: quantity,
      });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Thêm mới sản phẩm thành công!");
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={cn(
        "bg-[var(--tertiary)] text-white h-[44px] w-[160px] text-[15px] font-medium tracking-wide rounded-none hover:bg-[var(--primary)]",
      )}
    >
      Add to Cart
    </Button>
  );
};
