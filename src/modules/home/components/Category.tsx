import { Button } from "@/components/ui/button";
import { HomeTypes } from "@/types/home";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
const columnClassMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
};
const Category = ({ title, categories, btn, columns }: HomeTypes) => {    
    const baseCols = columns ?? 3;
    const gridColumns = columnClassMap[baseCols] || "grid-cols-3";
      const router = useRouter();
    return (
        <div>
            {title && (
                <h2 className="text-2xl text-[color:var(--primary)] font-semibold text-center my-6">
                    {title}
                </h2>
            )}
            <div
                className={`grid gap-4 ${gridColumns} md:${gridColumns}`}
            >
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center w-full"
                    >
                        <div>
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={150}
                                height={150}
                                loading="lazy"
                                quality={100}
                                className="rounded-full object-cover max-w-full"
                            />
                        </div>
                        <h3 className="text-lg font-medium my-3">
                            {category.name}
                        </h3>
                        {btn && btn === "Add to Cart" && (
                            <Button className="bg-[color:var(--primary)] text-white rounded-full px-6 py-2 font-semibold">
                                {btn}
                            </Button>
                        )}
                        {btn && btn === "Buy Now" && (
                            <Button
                            variant="ghost"
                            className="mt-2 text-[color:var(--text-color)] font-normal"
                            onClick={() =>
                              router.push(`/ecom/product`)
                            }
                          >
                            {btn}
                          </Button>
                        )}
                        {btn && btn === "Read More" && (
                            <Button
                                variant="link"
                                className="text-[color:var(--primary)] font-medium"
                            >
                                Read More &gt;
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
