"use client";

import { FormInputType } from "@/enum/FormInputType";
import { useFilterOptions } from "@/tanstack/filter";

export function useFilterFields() {
    const { brands, skinTypes, ingredients,skinConcerns, isLoading } = useFilterOptions();
  
    const fields = [
      {
        name: "brand",
        fieldType: FormInputType.SELECT,
        placeholder: "Chọn thương hiệu",
        options: [{ label: "Tất cả", value: "all" }].concat(
          brands.map(b => ({ label: b, value: b }))
        ),
      },
      {
        name: "skinType",
        fieldType: FormInputType.SELECT,
        placeholder: "Chọn loại da",
        options: [{ label: "Tất cả", value: "all" }].concat(
          skinTypes.map(s => ({ label: s, value: s }))
        ),
      },
      {
        name: "skinConcerns",  // ← thêm field mới
        fieldType: FormInputType.SELECT,
        placeholder: "Chọn vấn đề da",
        options: [{ label: "Tất cả", value: "all" }, ...skinConcerns.map(c => ({ label: c, value: c }))]
      },
      {
        name: "ingredients",               // <-- Đúng key
        fieldType: FormInputType.SELECT,
        placeholder: "Chọn thành phần",
        options: [{ label: "Tất cả", value: "all" }].concat(
          ingredients.map(i => ({ label: i, value: i }))
        ),
      },
      {
        name: "priceRange",
        fieldType: FormInputType.SLIDER,
        placeholder: "Khoảng giá",
        min: 0,
        max: 2_000_000,
        step: 10_000,
      },
    ];
  
    return { fields, isLoading };
  }