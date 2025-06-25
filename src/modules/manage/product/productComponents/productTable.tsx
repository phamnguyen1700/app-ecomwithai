"use client";

import { useEffect, useState } from "react";
import CustomTable from "@/components/common/CustomTable";
import { IProduct } from "@/types/product";
import { Column } from "@/types/table";
import { useProducts } from "@/tanstack/product";
import ProductDetailDialog from "./productDetailDialog";
export default function ProductTable() {
    const { data: products, isLoading } = useProducts();
    const [productsData, setProductsData] = useState<any>();
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    useEffect(() => {
        if (products?.data) {
            setProductsData(products.data);
        } else {
            setProductsData([]);
        }
    }, [products]);

    console.log(productsData);

    const handleRowClick = (product: IProduct) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const columns: Column<IProduct>[] = [
        {
            colName: "Tên sản phẩm",
            render: (product) => (
                <div className="font-medium">{product.name}</div>
            ),
        },
        {
            colName: "Thương hiệu",
            render: (product) => (
                <div className="text-xs text-gray-500">{product.brand}</div>
            ),
        },
        {
            colName: "Mô tả",
            render: (product) => (
                <div className="text-xs text-gray-500 line-clamp-2 max-w-xs">
                    {product.description}
                </div>
            ),
        },
        {
            colName: "Tồn kho",
            render: (product) => (
                <div className="flex justify-center text-xs text-gray-500">
                    {product?.skus.reduce((acc: any, sku: any) => acc + sku.stock, 0)}
                </div>
            ),
        },
        {
            colName: "Trạng thái",
            render: (product) => (
                <span
                    className={`flex justify-center px-2 py-1 text-xs rounded-full ${
                        product.isActive
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                    }`}
                >
                    {product.isActive ? "Đang bán" : "Ngừng bán"}
                </span>
            ),
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <CustomTable
                columns={columns}
                records={productsData}
                onRowClick={handleRowClick}
            />
            <ProductDetailDialog
                product={selectedProduct}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    );
}
