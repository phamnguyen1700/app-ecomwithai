"use client";

import AppItems from "@/components/core/AppItems";
import ProductFilterWrapper from "@/components/core/AppFilter/ProductFilterWrapper";
import { useState } from "react";
import { routesConfig } from "@/routes/config";

export default function Product() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
