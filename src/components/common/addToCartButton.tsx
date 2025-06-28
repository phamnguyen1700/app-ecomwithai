"use client";

import { Button } from "@/components/ui/button";
import { ISku } from "@/types/product";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useAddToCartMutation } from "@/tanstack/cart";
import { useAuthStore } from "@/zustand/store/userAuth";

interface AddToCartButtonProps {
  selectedSku: ISku;
  quantity: number;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  selectedSku,
  quantity,
}) => {
  const addToCartAPI = useAddToCartMutation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const handleAddToCart = () => {
    if (!accessToken) {
      toast.warning("Vui lòng đăng nhập trước khi mua hàng");
      return;
    }
    if (!selectedSku || quantity < 1) return;
    const now = new Date().toISOString();
    const body = {
      productId: selectedSku.productId,
      skuId: selectedSku._id,
      skuName: selectedSku.variantName,
      image: selectedSku.image,
      quantity,
      selected: true,
      addedAt: now,
      priceSnapshot: selectedSku.price,
      discountSnapshot: selectedSku.discount || 0,
      stockSnapshot: selectedSku.stock - (selectedSku.reservedStock || 0),
    };
    addToCartAPI.mutate(body, {
      onSuccess: () => {
        toast.success("Thêm mới sản phẩm thành công!");
      },
      onError: () => {
        toast.error("Có lỗi khi thêm sản phẩm vào giỏ hàng!");
      }
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={cn(
        "bg-[var(--tertiary)] text-white h-[44px] w-[160px] text-[15px] font-medium tracking-wide rounded-none hover:bg-[var(--primary)]",
      )}
      disabled={addToCartAPI.isPending}
    >
      {addToCartAPI.isPending ? "Đang thêm..." : "Add to Cart"}
    </Button>
  );
};
