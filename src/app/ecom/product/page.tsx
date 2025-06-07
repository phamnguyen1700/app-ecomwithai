"use client";

import { useProducts } from "@/tanstack/product";
import { IProduct } from "@/types/product";
import ProductCard from "@/components/common/productCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
    const { data: response, isLoading } = useProducts();
    const products = Array.isArray(response?.data?.data) ? response.data.data : [];    
    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="max-w-6xl mx-auto">
                    <div className="flex gap-2 mb-2 border-b-2 border-gray-200 pt-20">
                        <Select
                        //   value={filterParams.brandName}
                        //   onValueChange={(value) => updateFilterParams("brandName", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn thương hiệu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="--">Tất cả</SelectItem>
                                {/* {brands.map((brand) => (
              <SelectItem key={brand._id} value={brand.brandName}>
                {brand.brandName}
              </SelectItem>
            ))} */}
                            </SelectContent>
                        </Select>

                        <Select
                        //   value={filterParams.category}
                        //   onValueChange={(value) => updateFilterParams("category", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="--">Tất cả</SelectItem>
                                <SelectItem value="Cleanser">Cleanser</SelectItem>
                                <SelectItem value="Moisturizer">Moisturizer</SelectItem>
                                <SelectItem value="Serum">Serum</SelectItem>
                                <SelectItem value="Sunscreen">Sunscreen</SelectItem>
                                <SelectItem value="Toner">Toner</SelectItem>
                                <SelectItem value="Mask">Mask</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                        //   value={filterParams.skinType}
                        //   onValueChange={(value) => updateFilterParams("skinType", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Loại da" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="--">Tất cả</SelectItem>
                                <SelectItem value="oily">Oily</SelectItem>
                                <SelectItem value="dry">Dry</SelectItem>
                                <SelectItem value="combination">Combination</SelectItem>
                                <SelectItem value="sensitive">Sensitive</SelectItem>
                                <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* <PriceSlider
          minPrice={Number(filterParams.minPrice) || 0}
          maxPrice={Number(filterParams.maxPrice) || 2000000}
          minLimit={0}
          maxLimit={2000000}
          step={10000}
          onChange={([min, max]) => {
            updateFilterParams("minPrice", min.toString());
            updateFilterParams("maxPrice", max.toString());
          }} 
        />*/}

                        <Button
                        // onClick={handleSearch}
                        >Tìm kiếm</Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {products?.map((product: IProduct, idx: number) => (
                            <ProductCard
                                key={product._id || idx}
                                product={product}
                            />
                        ))}
                    </div >
                </div>
            )
            }
        </>
    );
}