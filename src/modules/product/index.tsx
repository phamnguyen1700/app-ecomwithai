"use client";

import AppItems from "@/components/core/AppItems";
import ProductFilterWrapper from "@/components/core/AppFilter/ProductFilterWrapper";
import { useState, useEffect } from "react";
import { routesConfig } from "@/routes/config";
import { useSearchParams } from "next/navigation";

export default function Product() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [initialFilters, setInitialFilters] = useState<any>({});
    const searchParams = useSearchParams();

    // Đọc filter từ URL khi component mount
    useEffect(() => {
        const filters: any = {};
        const suitableForSkinTypes = searchParams.get('suitableForSkinTypes');
        const skinConcerns = searchParams.get('skinConcerns');
        
        if (suitableForSkinTypes) {
            filters.suitableForSkinTypes = suitableForSkinTypes;
        }
        if (skinConcerns) {
            filters.skinConcerns = skinConcerns;
        }
        
        console.log('URL Search Params:', { suitableForSkinTypes, skinConcerns });
        console.log('Initial Filters:', filters);
        
        if (Object.keys(filters).length > 0) {
            setInitialFilters(filters);
        }
    }, [searchParams]);

    const handleFilterChange = (filters: any) => {
        console.log('Filters changed:', filters);
    };

    const handleDataChange = (data: any) => {
        console.log('Data changed:', data);
        setProducts(Array.isArray(data?.data) ? data.data : []);
        setIsLoading(false);
    };

    return (
        <div className="mt-24">
            <div className="container mx-auto py-4 px-6 shadow-md rounded-lg">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Mỹ phẩm</h1>
                    <p className="text-gray-600">Khám phá bộ sưu tập mỹ phẩm chất lượng cao</p>
                </div>
                
                <ProductFilterWrapper
                    onFilterChange={handleFilterChange}
                    onDataChange={handleDataChange}
                    initialFilters={initialFilters}
                />
                
                <AppItems
                    items={products}
                    loading={isLoading}
                    fields={{
                        name: "name",
                        img: "skus",
                        desc: "description",
                    }}
                    col={4}
                    path={routesConfig.products}
                />
            </div>
        </div>
    );
}
