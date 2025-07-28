"use client"

import { Button } from "@/components/ui/button";
import { HomeTypes } from "@/types/home";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
const columnClassMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
};
const Category = ({ title, categories, btn, columns }: HomeTypes) => {    
    const router = useRouter();
    const baseCols = columns ?? 3;
    const gridColumns = columnClassMap[baseCols] || "grid-cols-3";

    const handleCategoryClick = (category: any) => {
        // Xác định loại filter dựa trên title
        let filterType = '';
        let filterValue = '';
        
        if (title === "Sản phẩm dành cho da của bạn") {
            filterType = 'suitableForSkinTypes';
            filterValue = category.name; // Giá trị đã là lowercase
        } else if (title === "Sản phẩm hỗ trợ") {
            filterType = 'skinConcerns';
            filterValue = category.name; // Giá trị đã là lowercase
        }
        
        if (filterType && filterValue) {
            // Chuyển đến trang sản phẩm với filter
            const searchParams = new URLSearchParams();
            searchParams.set(filterType, filterValue);
            router.push(`/ecom/product?${searchParams.toString()}`);
        }
    };

    // Mapping để hiển thị tên tiếng Việt
    const skinTypeDisplayNames: { [key: string]: string } = {
        'normal': 'Da bình thường',
        'dry': 'Da khô',
        'oily': 'Da nhờn',
        'combination': 'Da hỗn hợp',
        'sensitive': 'Da nhạy cảm',
        'acne-prone': 'Da dễ mụn'
    };

    const skinConcernDisplayNames: { [key: string]: string } = {
        'acne': 'Mụn',
        'dullness': 'Da xỉn màu',
        'blackheads': 'Mụn đầu đen',
        'dryness': 'Da khô',
        'irritation': 'Kích ứng',
        'redness': 'Đỏ da'
    };

    const getDisplayName = (category: any) => {
        if (title === "Sản phẩm dành cho da của bạn") {
            return skinTypeDisplayNames[category.name] || category.name;
        } else if (title === "Sản phẩm hỗ trợ") {
            return skinConcernDisplayNames[category.name] || category.name;
        } else {
            // Xử lý cho trường hợp không có title (skinTypes)
            return skinTypeDisplayNames[category.name] || category.name;
        }
    };
    return (
        <div>
            {title && (
                <h2 className="text-2xl text-[color:var(--primary)] font-semibold text-center my-6">
                    {title}
                </h2>
            )}
            <div
                className={`grid gap-4 ${gridColumns} md:${gridColumns}`}
            >
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center w-full cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleCategoryClick(category)}
                    >
                        <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={150}
                                height={150}
                                loading="lazy"
                                quality={100}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-medium my-3">
                            {getDisplayName(category)}
                        </h3>
                        {btn && btn === "Thêm vào giỏ hàng" && (
                            <Button className="bg-[color:var(--primary)] text-white rounded-full px-6 py-2 font-semibold">
                                {btn}
                            </Button>
                        )}
                        {btn && btn === "Buy Now" && (
                            <Button
                                variant="ghost"
                                className="text-[color:var(--text-color)] font-normal"
                            >
                                {btn}
                            </Button>
                        )}
                        {btn && btn === "Xem thêm" && (
                            <Button
                                variant="link"
                                className="text-[color:var(--primary)] font-medium"
                            >
                                Xem thêm &gt;
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
