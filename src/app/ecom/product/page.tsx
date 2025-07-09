// src/app/ecom/product/page.tsx
import { Metadata } from "next";
import { createMetadata } from "@/components/core/AppPageMeta";
import { AppTypes } from "@/enum/home";
import ProductPage from "@/modules/product/index";  // <-- default import

export const metadata: Metadata = createMetadata({
  title: AppTypes.PRODUCTS,
  description: AppTypes.DESCRIPTION,
});

export default function ProductRoute() {
  return <ProductPage />;
}
