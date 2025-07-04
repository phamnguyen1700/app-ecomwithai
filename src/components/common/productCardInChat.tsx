"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { ISku, IProduct } from "@/types/product";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "@/tanstack/cart";
import { useAuthStore } from "@/zustand/store/userAuth";

interface Props {
  product: IProduct;
  compact?: boolean;
}

export default function ProductCardInChat({ product }: Props) {
  const [selectedSku, setSelectedSku] = useState<ISku>(product.skus?.[0]);
  const quantity = 1;
  const { mutate: addToCart } = useAddToCartMutation();
  const accessToken = useAuthStore((state) => state.accessToken);
  
  const handleAddToCart = () => {
    if (!accessToken) {
      toast.warning("Vui lòng đăng nhập trước khi mua hàng");
      return;
    }
    if (!selectedSku) return;
    addToCart(
      {
        skuId: selectedSku._id,
        productId: selectedSku.productId,
        skuName: selectedSku.variantName,
        image: selectedSku.images[0],
        quantity,
        priceSnapshot: selectedSku.price,
        discountSnapshot: selectedSku.discount,
        stockSnapshot: selectedSku.stock,
        selected: true,
        addedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => toast.success("Đã thêm vào giỏ hàng"),
        onError: () => toast.error("Lỗi khi thêm vào giỏ hàng"),
      }
    );
  };

  return (
    <div className="border rounded-md shadow-sm bg-white p-2.5 text-[10px] max-w-[270px] flex gap-2">
      <Image
        src={selectedSku.images[0] || "/assets/blank.png"}
        alt={product.name || "Không tải được tên sản phẩm!"}
        width={40}
        height={40}
        className="rounded object-cover flex-shrink-0"
      />
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="flex justify-between">
            <div className="font-semibold text-[12px] truncate mb-1">{product.name}</div>
          <div className="text-right min-w-[55px]">
            <span className="text-[9px] text-gray-400 line-through block">
              {selectedSku.discount > 0 && `${selectedSku.price.toLocaleString()}₫`}
            </span>
            <span className="text-[11px] font-semibold text-red-500">
              {(selectedSku.price * (1 - selectedSku.discount / 100)).toLocaleString()}₫
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          {/* <div className="flex items-center">
            <Button variant="link" size="sm" className="px-1 py-0 h-4 w-4 text-[12px] border-none hover:no-underline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
            <span className="text-[10px]">{quantity}</span>
            <Button variant="link" size="sm" className="px-1 py-0 h-4 w-4 text-[12px] border-none hover:no-underline" onClick={() => setQuantity(quantity + 1)}>+</Button>
          </div> */}
          <Select
            value={selectedSku._id}
            onValueChange={(val) => {
              const sku = product.skus?.find((sku: ISku) => sku._id === val);
              if (sku) setSelectedSku(sku);
            }}
          >
            <SelectTrigger className="w-11 h-5 text-[10px] text-[var(--light-color)] px-1 py-0">
              <SelectValue placeholder="Phân loại" />
            </SelectTrigger>
            <SelectContent>
              {product.skus?.map((sku: ISku) => (
                <SelectItem key={sku._id} value={sku._id} className="text-[10px] px-1 py-0 min-w-0">
                  {sku.variantName.split(" ")[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-5 px-2 py-0 text-[10px] bg-[color:var(--tertiary)] text-white rounded-none hover:bg-[color:var(--primary)]"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng x 1
          </Button>
        </div>
      </div>
    </div>
  );
}
