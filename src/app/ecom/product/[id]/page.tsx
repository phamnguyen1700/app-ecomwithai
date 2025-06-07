"use client";

import { useParams } from "next/navigation";
import { useProductDetail } from "@/tanstack/product";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-sm font-medium text-left"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && <div className="pb-4 text-sm text-gray-500">{children}</div>}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProductDetail(id as string);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <p className="text-center py-10">Đang tải sản phẩm...</p>;
  if (error || !product) return <p className="text-center py-10 text-red-500">Không tìm thấy sản phẩm.</p>;

  const sku = product.skus?.[0];
  const finalPrice = sku ? Math.round(sku.price * (1 - (sku.discount || 0) / 100)) : null;
  const isAvailable = sku && sku.stock > sku.reservedStock;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Section */}
        <div>
          <div className="relative w-full h-[400px] border rounded-lg overflow-hidden">
            <Image
              src={sku?.image?.trim() || "/placeholder.jpg"}
              alt={product.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {product.skus?.slice(0, 3).map((s) => (
              <div key={s._id} className="relative w-16 h-16 border rounded-md overflow-hidden">
                <Image
                  src={s.image?.trim() || "/placeholder.jpg"}
                  alt={s.variantName}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>

          {/* Expandable Sections */}
          <div className="mt-6 divide-y divide-gray-200">
            <Section title="Product Overview:">{product.description}</Section>
            <Section title="How To Use:">Thông tin đang cập nhật.</Section>
            <Section title="Add To Glance:">Thông tin đang cập nhật.</Section>
            <Section title="Ingredients:">{product.ingredients?.join(", ") || "Đang cập nhật..."}</Section>
            <Section title="Other Details:">
              <p>Mã lô: {sku?.batchCode}</p>
              <p>NSX: {sku?.manufacturedAt?.slice(0, 10)}</p>
              <p>HSD: {sku?.expiredAt?.slice(0, 10)}</p>
              <p>{sku?.returnable ? "Sản phẩm hỗ trợ hoàn trả." : "Không hỗ trợ hoàn trả."}</p>
              <p>{sku?.internalNotes || "Không có ghi chú."}</p>
            </Section>
          </div>
        </div>

        <div className="space-y-6 max-w-xl font-prompt text-[#000000] leading-[28px] text-[15px] capitalize">
  {/* Tên sản phẩm + giá */}
  <h1 className="text-[32px] leading-[44px] font-normal">{product.name}</h1>

  <div className="text-[22px] leading-[34px] font-normal text-[#9F9F9F]">
    {sku?.discount ? (
      <>
        <span className="line-through mr-3">₫{sku.price.toLocaleString()}</span>
        <span className="text-[#c04c4c] font-semibold">₫{finalPrice?.toLocaleString()}</span>
      </>
    ) : (
      <span className="text-black font-semibold">₫{sku?.price.toLocaleString()}</span>
    )}
  </div>

  {/* Mô tả ngắn */}
  <p className="text-[16px] text-[#2d2d2d]">
    Lorem Ipsum Dolor Sit Amet, Consectetur<br />Adipisicing Elit.
  </p>

  {/* Thông tin */}
  <div className="space-y-1 text-[15px]">
    <p><span className="font-semibold">Vendor:</span> {product.brand}</p>
    <p><span className="font-semibold">SKU:</span> {sku?.batchCode}</p>
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
    <p><span className="font-semibold">SIZE:</span> {sku?.variantName}</p>
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
    <button className="bg-[#CC857F] text-white h-[44px] w-[160px] text-[15px] font-medium tracking-wide">
      Add to Cart
    </button>
    <div className="border-[1.5px] border-[#CC857F] h-[44px] w-[44px] flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[22px] w-[22px] fill-[#CC857F]"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
        6.5 3.5 5 5.5 5c1.54 0 3.04.99 3.57 
        2.36h1.87C13.46 5.99 14.96 5 16.5 
        5 18.5 5 20 6.5 20 8.5c0 3.78-3.4 
        6.86-8.55 11.54L12 21.35z" />
      </svg>
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
