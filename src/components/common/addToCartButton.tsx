"use client";

import { Button } from "@/components/ui/button";
import Icon from "@/components/assests/icons";
import { IProduct } from "@/types/product";
import { CART_STORAGE_KEY } from "@/constants/storageKey";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  variant?: 'card' | 'detail';
  product: IProduct;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, variant }) => {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

    const existingIndex = cart.findIndex((item: { product: string }) => item.product === product._id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image[0],
        quantity: 1,
      });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Thêm mới sản phẩm thành công!");
  };

  return (
    <Button
      variant="ghost"
      onClick={handleAddToCart}
      className={cn(
        "flex items-center gap-2 bg-white text-black rounded-none hover:bg-stone-200",
        variant === "card" && "w-16",
        variant === "detail" && "w-full"
      )}

    >
      <Icon name="shoppingBasket" className="w-5 h-5" />
    </Button>
  );
};

