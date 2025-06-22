"use client";

import { useProducts } from "@/tanstack/product";
import AppItems from "@/components/core/AppItems";
import AppFilterForm from "@/components/core/AppFilter";
import { Fields } from "./fields";
import { AppTypes } from "@/enum/home";
import { useState } from "react";
import { routesConfig } from "@/routes/config";

export default function Product() {
    const [filters, setFilters] = useState({});
    const { data: response, isLoading } = useProducts(filters);
    console.log(response)
    const products = Array.isArray(response?.data)
        ? response.data
        : [];
    const handleFilterProduct = (value: any) => {
        setFilters(value)
    }
    return (
        <div className="mt-10">
            <AppFilterForm 
                filterItems={Fields()}
                onSubmit={handleFilterProduct}
                content={AppTypes.FINDING}
                col={4}
            />
            <AppItems
                items={products}
                loading={isLoading}
                fields={{
                    name: "name",
                    img: "imageUrl",
                    desc: "description",
                }}
                col={4}
                path={routesConfig.products}
            />
        </div>
    );
}
