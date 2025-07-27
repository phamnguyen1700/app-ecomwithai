"use client";

import { useProducts } from "@/tanstack/product";
import AppItems from "@/components/core/AppItems";
import AppFilterForm from "@/components/core/AppFilter";
import { Fields } from "./fields";
import { AppTypes } from "@/enum/home";
import { useState } from "react";
import { routesConfig } from "@/routes/config";

export default function Product() {
    const [filters, setFilters] = useState<any>({});
    const { search, ...apiFilters } = filters;

    const { data: response, isLoading } = useProducts(apiFilters); 
    const rawProducts = Array.isArray(response?.data) ? response.data : [];

    const products = search
        ? rawProducts.filter((item) =>
              item.name?.toLowerCase().includes(search.toLowerCase())
          )
        : rawProducts;

    const handleFilterProduct = (value: any) => {
        setFilters(value);
    };
    return (
        <div className="mt-32">
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
                    img: "skus",
                    desc: "description",
                }}
                col={4}
                path={routesConfig.products}
            />
        </div>
    );
}
