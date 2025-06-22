import React from "react";
import { AppTypes } from "@/enum/home";
import Image from "next/image";
import { ProductCardTypes } from "./../../../types/product";
import { useRouter } from "next/navigation";

const AppItems = ({
    items = [],
    fields = {},
    loading = false,
    col = 3,
    path,
}: ProductCardTypes) => {
    const router = useRouter();
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="p-4 animate-pulse bg-gray-100 h-48 rounded-md"
                    />
                ))}
            </div>
        );
    }
    if (!items || items.length === 0) return <div>{AppTypes.NO_DATA}</div>;
    return (
        <>
            <div className={`grid grid-cols-1 md:grid-cols-${col} gap-4`}>
                {items.map((item: any, index: any) => {
                    return (
                        <div
                            key={index}
                            className="border rounded-md shadow-sm p-4 space-y-2"
                            onClick={() => {
                                if (path) {
                                    router.push(`${path}/${item._id}`);
                                }
                            }}
                        >
                            <Image
                                width={200}
                                height={200}
                                src={item[fields?.img]}
                                alt={"alt"}
                                className="w-full h-32 object-cover rounded"
                            />
                            <h3 className="font-semibold text-sm truncate">
                                {item[fields?.name]}
                            </h3>
                            <p className="text-gray-500 text-xs truncate">
                                {item[fields?.desc]}
                            </p>
                            <div className="text-red-500 font-bold text-sm">
                                {item[fields?.price]}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default AppItems;
