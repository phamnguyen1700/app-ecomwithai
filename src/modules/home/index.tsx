"use client";
import { images } from "@/routes/config";
import React from "react";
import Category from "./components/Category";
import { AppTypes } from "@/enum/home";
import ShowInfo from "./components/ShowInfo";
import { useProducts } from "@/tanstack/product";
import { useRouter } from "next/navigation";
export default function HomePage() {
    // 1) Fetch products (chỉnh limit/page tuỳ bạn)
    const router = useRouter();
    const { data: res, isLoading, isError, error } = useProducts({ page: 1, limit: 5 });
  
    if (isLoading) return <div>Đang tải…</div>;
    if (isError)    return <div className="text-red-500">Lỗi: {String(error)}</div>;
  
    const promos = res!.data; // mảng tối đa 5 sản phẩm
    const products = res?.data || [];
  
    // 2) Lấy tập unique skinConcerns, giữ 4 phần tử
    const uniqueConcerns = Array.from(
      new Set(products.flatMap(p => p.skinConcerns || []))
    ).slice(0, 4);
  
    const categories = uniqueConcerns.map(name => ({
      name,
      // chuyển name thành key ảnh, fallback sang acne
      image:images.acne,
    }));
  
    // 3) Lấy tập unique suitableForSkinTypes, giữ 6 phần tử
    const uniqueTypes = Array.from(
      new Set(products.flatMap(p => p.suitableForSkinTypes || []))
    ).slice(0, 6);
  
    const skinTypes = uniqueTypes.map(name => ({
      name,
      image:images.skin,
    }));
  
    return (
        <main>
            <ShowInfo title={AppTypes.HOME} bigTitle description={AppTypes.DESCRIPTION} image={images.home} buttonLabel="Read more" width={700} height={500} />

            <Category
        title="Shop by Skin Concern"
        categories={categories}
        btn="Buy Now"
        columns={4}
      />
            
            <ShowInfo title={AppTypes.DISCOVER} bigTitle description={AppTypes.DISCOVER_DESC} image={images.about} width={600} height={400} buttonLabel="Read more" />

            <Category
        title="Shop by Skin Type"
        categories={skinTypes}
        btn="Read More"
        columns={6}
      />

{promos.map((prod, idx) => (
        <ShowInfo
          key={prod._id}
          title={prod.name ?? ""}    
          description={prod.description || AppTypes.DISCOVER_DESC}
          image={typeof prod.image?.[0] === "string" ? prod.image[0] : "/placeholder.png"}
          buttonLabel="Add To Cart"
          border
          {...(idx % 2 === 0 ? { reverse: true } : { textRight: true })}
          // width chỉ apply cho item cuối (idx === promos.length - 1)
          {...(idx === promos.length - 1 ? { width: 700 } : {})}
          // khi click, chuyển sang trang detail
          onButtonClick={() => router.push(`/ecom/product/${prod._id}`)}
        />
      ))}
        </main>
    );
};


