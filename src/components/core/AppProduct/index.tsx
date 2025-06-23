import { IProduct, ISku } from "@/types/product";
import React from "react";

type Props = {
    product: IProduct;
    selectedSku: ISku;
    setSelectedSku?: (sku: ISku) => void;
};

const AppProduct = ({ product, selectedSku, setSelectedSku }: Props) => {
    const finalPrice = Math.round(
        selectedSku.price * (1 - (selectedSku.discount || 0) / 100)
    );
    const isAvailable = selectedSku.stock > selectedSku.reservedStock;

    return (
        <div className="space-y-6 max-w-xl font-prompt text-[#000000] leading-[28px] text-[15px] capitalize">
            {/* Tên sản phẩm + giá */}
            <h1 className="text-[32px] leading-[44px] font-normal">
                {product.name}
            </h1>

            <div className="text-[22px] leading-[34px] font-normal text-[#9F9F9F]">
                {selectedSku?.discount ? (
                    <>
                        <span className="line-through mr-3">
                            ₫{selectedSku.price.toLocaleString()}
                        </span>
                        <span className="text-[#c04c4c] font-semibold">
                            ₫{finalPrice?.toLocaleString()}
                        </span>
                    </>
                ) : (
                    <span className="text-black font-semibold">
                        ₫{selectedSku?.price.toLocaleString()}
                    </span>
                )}
            </div>

            {/* Mô tả ngắn */}
            <p className="text-[16px] text-[#2d2d2d]">
                Lorem Ipsum Dolor Sit Amet, Consectetur
                <br />
                Adipisicing Elit.
            </p>

            {/* Thông tin */}
            <div className="space-y-1 text-[15px]">
                <p>
                    <span className="font-semibold">Vendor:</span>{" "}
                    {product.brand}
                </p>
                <p>
                    <span className="font-semibold">SKU:</span>{" "}
                    {selectedSku?.batchCode}
                </p>
                <p>
                    <span className="font-semibold">Availability:</span>{" "}
                    <span
                        className={
                            isAvailable ? "text-green-600" : "text-red-500"
                        }
                    >
                        {isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                </p>
                <p>
                    <span className="font-semibold">Tags:</span> 3 Day Glow, All
                    Products, Cream, Face, Nightcream, SkinWhite, Women,
                    <br />
                    WomenFace
                </p>
            </div>

            {/* SKU Selection */}
            <div className="flex gap-2 flex-wrap mt-2">
                {product.skus?.map((sku: ISku) => (
                    <button
                        key={sku._id}
                        onClick={() => setSelectedSku?.(sku)}
                        className={`px-3 py-1 border rounded-md text-sm ${
                            selectedSku?._id === sku._id
                                ? "border-black font-semibold"
                                : "border-gray-300"
                        }`}
                    >
                        {sku.variantName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AppProduct;
