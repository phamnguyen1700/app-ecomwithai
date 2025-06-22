"use client";

import { useParams } from "next/navigation";
import { useProductDetail } from "@/tanstack/product";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ISku } from "@/types/product";
import AppSection from "@/components/core/AppSection";
import AppProduct from "@/components/core/AppProduct";
import AppDivider from "@/components/core/AppDivider";
import { HeartIcon } from "@/components/core/AppIcons";
import { useAddToCartMutation } from "@/tanstack/cart";
import { useCartStore } from "@/zustand/store/cart/cartStore";

export default function ProductDetail() {
    const { id } = useParams();
    const { data: product, isLoading, error } = useProductDetail(id as string);
    const [quantity, setQuantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState<ISku | null>(null);
    const { mutate: addToCartAPI } = useAddToCartMutation();
    useEffect(() => {
        if (product?.skus?.length) {
            setSelectedSku(product.skus[0]);
        }
    }, [product]);

    if (isLoading)
        return <p className="text-center py-10">Đang tải sản phẩm...</p>;
    if (error || !product || !selectedSku)
        return (
            <p className="text-center py-10 text-red-500">
                Không tìm thấy sản phẩm.
            </p>
        );
    const handleAddToCart = () => {
        if (!product || !selectedSku) return;
        const now = new Date().toISOString();

        const body = {
            productId: product._id,
            skuId: selectedSku._id,
            skuName: selectedSku.variantName,
            image: selectedSku.image,
            quantity,
            selected: true,
            addedAt: now,
            priceSnapshot: selectedSku.price,
            discountSnapshot: selectedSku.discount || 0,
            stockSnapshot: selectedSku.stock - selectedSku.reservedStock,
        };
        addToCartAPI(body, {
            onSuccess: () => {
                console.log("Sucess");
            },
            onError: (err) => {
                console.error(err);
            },
        });

        useCartStore.getState().addToCart({
            _id: selectedSku._id,
            name: product.name,
            image: selectedSku.image,
            price: Math.round(
                selectedSku.price * (1 - (selectedSku.discount || 0) / 100)
            ),
            quantity,
        });

        setQuantity(1);
    };
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Section */}
                <div>
                    <div className="relative w-full h-[400px] border rounded-lg overflow-hidden">
                        <Image
                            src={selectedSku?.image?.trim() || ""}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {product.skus?.slice(0, 3).map((s) => (
                            <div
                                key={s._id}
                                className="relative w-16 h-16 border rounded-md overflow-hidden"
                            >
                                <Image
                                    src={s.image?.trim() || ""}
                                    alt={s.variantName}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Expandable Sections */}
                    <div className="mt-6 divide-y divide-gray-200">
                        <AppSection title="Product Overview:">
                            {product.description}
                        </AppSection>
                        <AppSection title="How To Use:">
                            Thông tin đang cập nhật.
                        </AppSection>
                        <AppSection title="Add To Glance:">
                            Thông tin đang cập nhật.
                        </AppSection>
                        <AppSection title="Ingredients:">
                            {product.ingredients?.join(", ") ||
                                "Đang cập nhật..."}
                        </AppSection>
                        <AppSection title="Other Details:">
                            <p>Mã lô: {selectedSku?.batchCode}</p>
                            <p>
                                NSX: {selectedSku?.manufacturedAt?.slice(0, 10)}
                            </p>
                            <p>HSD: {selectedSku?.expiredAt?.slice(0, 10)}</p>
                            <p>
                                {selectedSku?.returnable
                                    ? "Sản phẩm hỗ trợ hoàn trả."
                                    : "Không hỗ trợ hoàn trả."}
                            </p>
                            <p>
                                {selectedSku?.internalNotes ||
                                    "Không có ghi chú."}
                            </p>
                        </AppSection>
                    </div>
                </div>

                <div className="space-y-6 max-w-xl font-prompt text-[#000000] leading-[28px] text-[15px] capitalize">
                    <AppProduct
                        product={product}
                        selectedSku={selectedSku}
                        setSelectedSku={setSelectedSku}
                    />

                    <AppDivider />

                    {/* Quantity & Add to cart */}
                    <div className="flex items-center gap-4">
                        <div className="flex border-[1.5px] border-black h-[44px]">
                            <button
                                className="w-11 h-full flex items-center justify-center text-[18px]"
                                onClick={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                }
                            >
                                −
                            </button>
                            <span className="w-11 flex items-center justify-center text-[16px]">
                                {quantity}
                            </span>
                            <button
                                className="w-11 h-full flex items-center justify-center text-[18px]"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="bg-[#CC857F] text-white h-[44px] w-[160px] text-[15px] font-medium tracking-wide"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                        <div className="border-[1.5px] border-[#CC857F] h-[44px] w-[44px] flex items-center justify-center">
                            <HeartIcon />
                        </div>
                    </div>

                    {/* Delivery & Returns */}
                    <div className="pt-4 border-t border-[#000000] space-y-2">
                        <p className="font-semibold text-[15px]">
                            Delivery & Returns
                        </p>
                        <p className="text-[14px] text-gray-700 leading-[24px]">
                            Sed do eiusmod tempor incididunt ut labore et dolore
                            magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat.
                        </p>
                        <a
                            href="#"
                            className="text-[15px] underline hover:text-blue-600 font-medium"
                        >
                            Our Return Policy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
