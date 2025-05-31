import { Button } from "@/components/ui/button";
import { FlexSectionProps } from "@/types/home";
import Image from "next/image";
import React from "react";

const ShowInfo: React.FC<FlexSectionProps> = ({
    title,
    description,
    image,
    reverse = false,
    buttonLabel,
    onButtonClick,
    children,
}) => {
    return (
        <div
            className={`flex flex-col-reverse md:flex-row items-center gap-8 py-10 ${
                reverse ? "md:flex-row-reverse" : ""
            }`}
        >
            <div className="flex-1 text-left px-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--primary)] mb-4">
                    {title}
                </h2>
                {description && (
                    <p className="text-gray-600 mb-4">{description}</p>
                )}
                {children}
                {buttonLabel && (
                    <Button
                        onClick={onButtonClick}
                        className="text-[color:var(--primary)] font-semibold px-0"
                        variant="link"
                    >
                        {buttonLabel} &gt;
                    </Button>
                )}
            </div>

            <div className="flex-1 px-4 text-center items-center">
                <Image
                    src={image}
                    alt={title}
                    width={450}
                    height={300}
                    className="object-contain mx-auto"
                />
            </div>
        </div>
    );
};

export default ShowInfo;
