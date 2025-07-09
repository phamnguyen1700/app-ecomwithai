// src/modules/product/ProductPage.tsx
"use client";

import { useState, useMemo } from "react";
import { useProducts }  from "@/tanstack/product";
import AppFilterForm    from "@/components/core/AppFilter";
import AppItems         from "@/components/core/AppItems";
import { useFilterFields } from "./fields";
import { AppTypes }     from "@/enum/home";
import { routesConfig } from "@/routes/config";

export default function ProductPage() {
  const { fields, isLoading: filtersLoading } = useFilterFields();

  // chỉ gửi lên server những param API hiểu
  const [serverFilters, setServerFilters] = useState<Record<string, any>>({});
  // giữ lại raw values người dùng chọn
  const [rawValues, setRawValues]       = useState<Record<string, any>>({});

  function handleFilterProduct(values: Record<string, any>) {
    const payload: Record<string, any> = {};
    if (values.search)    payload.search    = values.search;
    if (values.brand   && values.brand!=="all")    payload.brand       = values.brand;
    if (values.category&& values.category!=="all") payload.category    = values.category;
    if (values.priceRange) {
      payload.minPrice = values.priceRange[0];
      payload.maxPrice = values.priceRange[1];
    }

    setServerFilters(payload);
    setRawValues(values);
  }

  const { data: resp, isLoading: prodLoading } = useProducts(serverFilters);
  const allProducts = Array.isArray(resp?.data) ? resp.data : [];

  // lọc client-side cho skinType, skinConcerns, ingredients
  const displayedProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (rawValues.skinType && rawValues.skinType !== "all"
        && !p.suitableForSkinTypes?.includes(rawValues.skinType)) {
        return false;
      }
      if (rawValues.skinConcerns && rawValues.skinConcerns !== "all"
        && !p.skinConcerns?.includes(rawValues.skinConcerns)) {
        return false;
      }
      if (rawValues.ingredients && rawValues.ingredients !== "all"
        && !p.ingredients?.includes(rawValues.ingredients)) {
        return false;
      }
      return true;
    });
  }, [allProducts, rawValues]);

  return (
    <div className="mt-10">
      <AppFilterForm
        filterItems={fields}
        onSubmit={handleFilterProduct}
        content={AppTypes.FINDING}
        disabled={filtersLoading}
      />

      <AppItems
        items={displayedProducts}
        loading={prodLoading}
        fields={{ name: "name", img: "imageUrl", desc: "description" }}
        col={4}
        path={routesConfig.products}
      />
    </div>
  );
}
