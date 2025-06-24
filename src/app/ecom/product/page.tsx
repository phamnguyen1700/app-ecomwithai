import { createMetadata } from "@/components/core/AppPageMeta";
import { AppTypes } from "@/enum/home";
import { ProductPage } from "@/modules/product/ProductPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = createMetadata({
    title: AppTypes.PRODUCTS,
    description: AppTypes.DESCRIPTION,
});
const Proudct = () => {
    return <ProductPage />
};
export default Proudct;
