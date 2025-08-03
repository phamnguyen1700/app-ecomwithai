import React from "react";
import { AppTypes } from "@/enum/home";
import Image from "next/image";
import { ProductCardTypes } from "./../../../types/product";
import { useRouter } from "next/navigation";

const AppItems = ({
    items = [],
    fields = {},
    loading = false,
    col = 3,
    path,
}: ProductCardTypes) => {
    const router = useRouter();
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="p-4 animate-pulse bg-gray-100 h-48 rounded-md"
                    />
                ))}
            </div>
        );
    }
    if (!items || items.length === 0) return <div>{AppTypes.NO_DATA}</div>;
    return (
        <>
            <div className={`grid grid-cols-1 md:grid-cols-${col} gap-4`}>
                {items.map((item: any, index: any) => {
                    return (
                        <div
                            key={index}
                            className="border rounded-md shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                            onClick={() => {
                                if (path) {
                                    router.push(`${path}/${item._id}`);
                                }
                            }}
                        >
                            <Image
                                width={200}
                                height={200}
                                src={item[fields?.img]?.[0]?.images?.[0] || "/assets/blank.jpg"}
                                alt={"alt"}
                                className="w-full h-32 object-cover rounded"
                            />
                            <div className="p-4">
                            <h3 className="font-semibold text-sm truncate">
                                {item[fields?.name]}
                            </h3>
                            <p className="text-gray-500 text-xs truncate">
                                {item[fields?.desc]}
                            </p>
                            <div className="text-red-500 font-semibold text-sm text-right">
                                {(() => {
                                    if (item[fields?.price]) {
                                        return item[fields?.price];
                                    }
                                    
                                    if (item.skus && item.skus.length > 0) {
                                        const prices = item.skus
                                            .map((sku: any) => sku.price || 0)
                                            .filter((price: number) => price > 0);
                                        
                                        if (prices.length > 0) {
                                            const minPrice = Math.min(...prices);
                                            const maxPrice = Math.max(...prices);
                                            
                                            if (minPrice === maxPrice) {
                                                return `${minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ₫`;
                                            } else {
                                                return `${minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} - ${maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ₫`;
                                            }
                                        }
                                    }
                                    
                                    return '—';
                                })()}
                            </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default AppItems;
