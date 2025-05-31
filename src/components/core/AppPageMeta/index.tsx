import type { Metadata } from "next";

export const createMetadata = ({
    title,
    description,
}: {
    title?: string;
    description?: string;
}): Metadata => {
    const baseTitle = "Beauty Commerce";
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const fullDescription =
        description ||
        "Nền tảng thương mại điện tử hiện đại cho sản phẩm làm đẹp.";

    return {
        title: fullTitle,
        description: fullDescription,
    };
};
