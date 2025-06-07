import { createMetadata } from "@/components/core/AppPageMeta";
import { AppTypes } from "@/enum/home";
import { HomePageContent } from "@/modules/home/HomePage";
import { Metadata } from "next";
export const metadata: Metadata = createMetadata({
    title: AppTypes.HOME,
    description: AppTypes.DESCRIPTION,
});
export default function Home() {
    return (
        <>
            <HomePageContent />
        </>
    );
}
