import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProducts } from "@/tanstack/product";

interface AppFilterFormProps {
    filterItems?: any[];
    onSubmit?: any;
    content?: any;
    col?: number;
    showAdvancedFilters?: boolean;
    onProductTypeChange?: (type: 'new' | 'returned') => void;
}

const AppFilterForm = ({
    onSubmit = () => { },
    showAdvancedFilters = true,
    onProductTypeChange,
}: AppFilterFormProps) => {
    const [formValues, setFormValues] = useState<any>({});
    const [productType, setProductType] = useState<'new' | 'returned'>('new');
    const [brands, setBrands] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
    const [suitableForSkinTypes, setSuitableForSkinTypes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

    // Lấy tất cả sản phẩm để extract các giá trị unique
    const { data: productsData } = useProducts({ page: 1, limit: 1000 });

    useEffect(() => {
        if (productsData?.data) {
            const products = productsData.data;

            // Extract unique brands
            const uniqueBrands = [...new Set(products.map((p: any) => p.brand).filter(Boolean))];
            setBrands(uniqueBrands);

            // Extract unique ingredients
            const allIngredients = products.flatMap((p: any) => p.ingredients || []);
            const uniqueIngredients = [...new Set(allIngredients)] as string[];
            setIngredients(uniqueIngredients);

            // Extract unique skin concerns
            const allSkinConcerns = products.flatMap((p: any) => p.skinConcerns || []);
            const uniqueSkinConcerns = [...new Set(allSkinConcerns)] as string[];
            setSkinConcerns(uniqueSkinConcerns);

            // Extract unique suitable for skin types
            const allSuitableForSkinTypes = products.flatMap((p: any) => p.suitableForSkinTypes || []);
            const uniqueSuitableForSkinTypes = [...new Set(allSuitableForSkinTypes)] as string[];
            setSuitableForSkinTypes(uniqueSuitableForSkinTypes);

            // Extract price range from SKUs
            const allPrices = products.flatMap((p: any) =>
                p.skus && p.skus.length > 0
                    ? p.skus.map((sku: any) => sku.price || 0)
                    : [0]
            );

            // Filter out 0 prices and find min/max
            const validPrices = allPrices.filter(price => price > 0);
            const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
            const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 1000000;

            setPriceRange([minPrice, maxPrice]);
        }
    }, [productsData]);

    const handleChange = (nameOrValue: string | undefined, value?: any) => {
        if (typeof nameOrValue === "undefined") {
            setFormValues(() => value);
        } else {
            setFormValues((prev: any) => ({ ...prev, [nameOrValue]: value }));
        }
    };

    const handleFilter = () => {
        if (onSubmit) {
            // Filter out "all" values and empty values
            const filteredValues = Object.fromEntries(
                Object.entries(formValues).filter(([value]) =>
                    value !== "all" && value !== "" && value !== undefined && value !== null
                )
            );
            onSubmit(filteredValues);
        }
    };

    const handleProductTypeChange = (type: 'new' | 'returned') => {
        setProductType(type);
        if (onProductTypeChange) {
            onProductTypeChange(type);
        }
    };

    const handleReset = () => {
        setFormValues({});
        setProductType('new');
        if (onSubmit) {
            onSubmit({});
        }
        if (onProductTypeChange) {
            onProductTypeChange('new');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs mb-5">
            <div className="space-y-4">

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                    <>
                        {/* Selector Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="suitableForSkinTypes">Loại da phù hợp</Label>
                                <Select value={formValues.suitableForSkinTypes || ""} onValueChange={(value) => handleChange("suitableForSkinTypes", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại da" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {suitableForSkinTypes.map((skinType) => (
                                            <SelectItem key={skinType} value={skinType}>
                                                {skinType}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="brand">Thương hiệu</Label>
                                <Select value={formValues.brand || ""} onValueChange={(value) => handleChange("brand", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thương hiệu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand} value={brand}>
                                                {brand}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="ingredients">Thành phần</Label>
                                <Select value={formValues.ingredients || ""} onValueChange={(value) => handleChange("ingredients", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thành phần" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {ingredients.map((ingredient) => (
                                            <SelectItem key={ingredient} value={ingredient}>
                                                {ingredient}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="skinConcerns">Vấn đề da</Label>
                                <Select value={formValues.skinConcerns || ""} onValueChange={(value) => handleChange("skinConcerns", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn vấn đề da" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {skinConcerns.map((concern) => (
                                            <SelectItem key={concern} value={concern}>
                                                {concern}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Main Filters Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Tên sản phẩm */}
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium mb-2 block">Tên sản phẩm</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formValues.name || ""}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Tên sản phẩm"
                                    className="w-full"
                                />
                            </div>

                            {/* Price Slider */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    {(formValues.minPrice || priceRange[0]).toLocaleString('vi-VN')}₫ - {(formValues.maxPrice || priceRange[1]).toLocaleString('vi-VN')}₫
                                </Label>
                                <div className="px-4">
                                    <Slider
                                        value={[formValues.minPrice || priceRange[0], formValues.maxPrice || priceRange[1]]}
                                        onValueChange={(value) => {
                                            if (value[0] !== priceRange[0]) {
                                                handleChange("minPrice", value[0]);
                                            } else {
                                                handleChange("minPrice", undefined);
                                            }
                                            if (value[1] !== priceRange[1]) {
                                                handleChange("maxPrice", value[1]);
                                            } else {
                                                handleChange("maxPrice", undefined);
                                            }
                                        }}
                                        min={priceRange[0]}
                                        max={priceRange[1]}
                                        step={1000}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                                    <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                                    <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>

                            {/* Product Type Buttons */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Loại hàng</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={productType === 'new' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleProductTypeChange('new')}
                                        className="flex-1"
                                    >
                                        Hàng mới
                                    </Button>
                                    <Button
                                        variant={productType === 'returned' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleProductTypeChange('returned')}
                                        className="flex-1"
                                    >
                                        Hàng thanh lý
                                    </Button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Thao tác</Label>
                                <div className="flex gap-2">
                                    <Button onClick={handleFilter} className="flex-1">
                                        Tìm kiếm
                                    </Button>
                                    <Button variant="outline" onClick={handleReset} className="flex-1">
                                        Xóa bộ lọc
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AppFilterForm;
