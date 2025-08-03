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
    width = 500,
    height = 300,
    textRight = false,  
    border = false,
    bigTitle = false,
    children,
}) => {
    return (
        <div
            className={`flex flex-col-reverse md:flex-row items-center py-10 ${
                reverse ? "md:flex-row-reverse" : ""
            }`}
        >
            <div className={`flex-1 ${textRight ? 'text-right' : ''} text-left px-4`}>
                <h2 className={`${bigTitle ? 'text-6xl' : 'text-4xl'} font-semibold text-[color:var(--primary)] mb-4`}>
                    {title}
                </h2>
                {description && (
                    <p className="text-gray-600 mb-4">{description}</p>
                )}
                {children}
                {buttonLabel && (
                    <Button
                        onClick={onButtonClick}
                        className="text-[color:var(--primary)] font-semibold px-0 text-2xl"
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
                    width={width}
                    height={height}
                    loading="lazy"
                    quality={100}
                    className={`object-contain mx-auto ${border ? 'border-[1px] border-[#BF6159] rounded-lg' : ''}`}
                />
            </div>
        </div>
    );
};

export default ShowInfo;
