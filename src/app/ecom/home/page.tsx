import { createMetadata } from "@/components/core/AppPageMeta";
import { HomeTypes } from "@/enum/home";
import { HomePageContent } from "@/modules/home/HomePage";
import { Metadata } from "next";
export const metadata: Metadata = createMetadata({
    title: HomeTypes.HOME,
    description: HomeTypes.DESCRIPTION,
});
export default function Home() {
    return (
        <>
            <HomePageContent />
        </>
    );
}
