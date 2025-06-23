import { createMetadata } from "@/components/core/AppPageMeta";
import { AppTypes } from "@/enum/home";
import { CartPage } from "@/modules/cart/CartPage";
import { Metadata } from "next";
export const metadata: Metadata = createMetadata({
    title: AppTypes.CART,
    description: AppTypes.HOME,
});
export default function Home() {
    return (
        <>
            <CartPage />
        </>
    );
}
