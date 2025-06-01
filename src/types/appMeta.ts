import { ReactNode } from "react";

export type AppPageMetaProps = {
    children?: ReactNode;
    title?: string;
    description?: string;
    image?: string;
    contentType?: string;
};
