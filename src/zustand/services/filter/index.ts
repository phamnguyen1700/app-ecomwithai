// src/services/filterService.ts
import http from "@/util/axiosInterceptor";
import { IProduct } from "@/types/product";
async function fetchAllProducts(): Promise<IProduct[]> {
    const res = await http.get<{ data: IProduct[]; meta: any }>(
      "/product?limit=1000&page=1"
    );
    return res.data.data;
  }
  
  export async function getBrands(): Promise<string[]> {
    const products = await fetchAllProducts();
    return Array.from(new Set(products.map(p => p.brand!).values()));
  }
  
  export async function getSkinTypes(): Promise<string[]> {
    const products = await fetchAllProducts();
    const s = new Set<string>();
    products.forEach(p => p.suitableForSkinTypes?.forEach(t => s.add(t)));
    return Array.from(s.values());
  }
  
  export async function getIngredients(): Promise<string[]> {
    const products = await fetchAllProducts();
    const s = new Set<string>();
    products.forEach(p => p.ingredients?.forEach(i => s.add(i)));
    return Array.from(s.values());
  }
  export async function getSkinConcerns(): Promise<string[]> {
    const products = await fetchAllProducts();
    const s = new Set<string>();
    products.forEach(p => p.skinConcerns?.forEach(c => s.add(c)));
    return Array.from(s.values());
  }