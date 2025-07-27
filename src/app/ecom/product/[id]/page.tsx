"use client";

import { useParams } from "next/navigation";
import { useProductDetail } from "@/tanstack/product";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ISku } from "@/types/product";
import { AddToCartButton } from "@/components/common/addToCartButton";
import AppSection from "@/components/core/AppSection";
import { HeartIcon } from "@/components/core/AppIcons";


export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProductDetail(id as string);
  const [quantity, setQuantity] = useState(1);
  const [selectedSku, setSelectedSku] = useState<ISku | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    if (product?.skus?.length) {
      setSelectedSku(product.skus[0]);
    }
  }, [product]);

  useEffect(() => {
    setSelectedImageIdx(0);
  }, [selectedSku]);


  if (isLoading)
    return <p className="text-center py-10">Đang tải sản phẩm...</p>;
  if (error || !product || !selectedSku)
    return (
      <p className="text-center py-10 text-red-500">
        Không tìm thấy sản phẩm.
      </p>
    );

  // Calculate final price and availability
  const finalPrice = selectedSku.discount
    ? Math.round(selectedSku.price * (1 - selectedSku.discount / 100))
    : selectedSku.price;
  const isAvailable = (selectedSku.stock - selectedSku.reservedStock) > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Section */}
        <div>
          <div className="relative w-full h-[400px] border rounded-lg overflow-hidden">
            <Image
              src={selectedSku?.images?.[selectedImageIdx]?.trim() || "/placeholder.jpg"}
              alt={product.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {selectedSku?.images?.map((img, idx) => (
              <div
                key={idx}
                className={`relative w-16 h-16 border rounded-md overflow-hidden cursor-pointer ${selectedImageIdx === idx ? 'border-black' : 'border-gray-300'}`}
                onClick={() => setSelectedImageIdx(idx)}
              >
                <Image
                  src={img?.trim() || '/assets/blank.jpg'}
                  alt={selectedSku.variantName}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
          {/* Expandable Sections */}
          <div className="mt-6 divide-y divide-gray-200">
            <AppSection title="Product Overview:">{product.description}</AppSection>
            <AppSection title="How To Use:">Thông tin đang cập nhật.</AppSection>
            <AppSection title="Add To Glance:">Thông tin đang cập nhật.</AppSection>
            <AppSection title="Ingredients:">{product.ingredients?.join(", ") || "Đang cập nhật..."}</AppSection>
            <AppSection title="Other Details:">
              <p>Mã lô: {selectedSku?.batchCode}</p>
              <p>NSX: {selectedSku?.manufacturedAt?.slice(0, 10)}</p>
              <p>HSD: {selectedSku?.expiredAt?.slice(0, 10)}</p>
              <p>{selectedSku?.returnable ? "Sản phẩm hỗ trợ hoàn trả." : "Không hỗ trợ hoàn trả."}</p>
              <p>{selectedSku?.internalNotes || "Không có ghi chú."}</p>
            </AppSection>
          </div>
        </div>
        {/* Product Info Section */}
        <div className="space-y-6 max-w-xl font-prompt text-[#000000] leading-[28px] text-[15px] capitalize">
          {/* Tên sản phẩm + giá */}
          <h1 className="text-[32px] leading-[44px] font-normal">{product.name}</h1>
          <div className="text-[22px] leading-[34px] font-normal text-[#9F9F9F]">
            {selectedSku?.discount ? (
              <>
                <span className="line-through mr-3">₫{selectedSku.price.toLocaleString()}</span>
                <span className="text-[#c04c4c] font-semibold">₫{finalPrice?.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-black font-semibold">₫{selectedSku?.price.toLocaleString()}</span>
            )}
          </div>
          {/* Mô tả ngắn */}
          <p className="text-[16px] text-[#2d2d2d]">
            Lorem Ipsum Dolor Sit Amet, Consectetur<br />Adipisicing Elit.
          </p>
          {/* Thông tin */}
          <div className="space-y-1 text-[15px]">
            <p><span className="font-semibold">Vendor:</span> {product.brand}</p>
            <p><span className="font-semibold">SKU:</span> {selectedSku?.batchCode}</p>
            <p>
              <span className="font-semibold">Availability:</span>{" "}
              <span className={isAvailable ? "text-green-600" : "text-red-500"}>
                {isAvailable ? "In Stock" : "Out of Stock"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Tags:</span>{" "}
              3 Day Glow, All Products, Cream, Face, Nightcream, SkinWhite, Women,<br />WomenFace
            </p>
          </div>
          {/* SKU Selection */}
          <div className="flex gap-2 flex-wrap mt-2">
            {product.skus?.map((sku) => (
              <button
                key={sku._id}
                onClick={() => setSelectedSku(sku)}
                className={`px-3 py-1 border rounded-md text-sm ${selectedSku?._id === sku._id ? "border-black font-semibold" : "border-gray-300"}`}
              >
                {sku.variantName}
              </button>
            ))}
          </div>
          {/* Divider */}
          <hr className="my-2 border-[#000000] border-[1.2px]" />
          {/* Quantity & Add to cart */}
          <div className="flex items-center gap-4">
            <div className="flex border-[1.5px] border-black h-[44px]">
              <button
                className="w-11 h-full flex items-center justify-center text-[18px]"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className="w-11 flex items-center justify-center text-[16px]">{quantity}</span>
              <button
                className="w-11 h-full flex items-center justify-center text-[18px]"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <AddToCartButton selectedSku={selectedSku} quantity={quantity} />
            <div className="border-[1.5px] border-[#CC857F] h-[44px] w-[44px] flex items-center justify-center">
              <HeartIcon />
            </div>
          </div>
          {/* Delivery & Returns */}
          <div className="pt-4 border-t border-[#000000] space-y-2">
            <p className="font-semibold text-[15px]">Delivery & Returns</p>
            <p className="text-[14px] text-gray-700 leading-[24px]">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <a href="#" className="text-[15px] underline hover:text-blue-600 font-medium">
              Our Return Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
