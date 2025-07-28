import React, { useState } from 'react';
import AppFilterForm from './index';
import { useProducts, useReturnedSkus } from '@/tanstack/product';

interface ProductFilterWrapperProps {
    onFilterChange: (filters: any) => void;
    onDataChange: (data: any) => void;
    initialFilters?: any;
}

const ProductFilterWrapper: React.FC<ProductFilterWrapperProps> = ({
    onFilterChange,
    onDataChange,
    initialFilters = {},
}) => {
    const [productType, setProductType] = useState<'new' | 'returned'>('new');
    const [filters, setFilters] = useState<any>(initialFilters);

    // Sử dụng hook tương ứng với loại hàng
    const productsQuery = useProducts(productType === 'new' ? filters : {});
    const returnedSkusQuery = useReturnedSkus(productType === 'returned' ? filters : undefined);

    // Lấy data từ query tương ứng
    const currentData = productType === 'new' ? productsQuery.data : returnedSkusQuery.data;

    // Cập nhật data khi thay đổi
    React.useEffect(() => {
        if (currentData) {
            onDataChange(currentData);
        }
    }, [currentData, onDataChange]);

    const handleFilter = (newFilters: any) => {
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleProductTypeChange = (type: 'new' | 'returned') => {
        setProductType(type);
        setFilters({}); // Reset filters khi đổi loại hàng
        onFilterChange({});
    };

    return (
        <AppFilterForm
            onSubmit={handleFilter}
            onProductTypeChange={handleProductTypeChange}
            showAdvancedFilters={true}
            initialFilters={initialFilters}
        />
    );
};

export default ProductFilterWrapper; 