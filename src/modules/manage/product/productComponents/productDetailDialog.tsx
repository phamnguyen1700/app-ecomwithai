"use client";

import { IProduct, ISku } from "@/types/product";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import StatusToggleBadge from "@/components/common/statusToggleBadge";
import CheckboxBadge from "@/components/common/checkboxBadge";
import EditDetailList from "@/components/common/editDetailList";
import SkuImagesUpload from "./skuImagesUpload";
import { useState, useRef, useEffect } from "react";
import { useUpdateProductMutation, useUpdateSkuMutation, useGetProductDetailMutation, useDeleteProductSkuMutation } from "@/tanstack/product";
import AddSkuDialog from "./addSkuDialog";

interface ProductDetailDialogProps {
    product: IProduct | null;
    isOpen: boolean;
    onClose: () => void;
}

const skinTypeOptions = [
    { label: "Da thường", value: "normal" },
    { label: "Da khô", value: "dry" },
    { label: "Da dầu", value: "oily" },
    { label: "Da hỗn hợp", value: "combination" },
    { label: "Da nhạy cảm", value: "sensitive" },
];

const formulationTypeOptions = [
    { label: "Kem (cream)", value: "cream" },
    { label: "Gel", value: "gel" },
    { label: "Serum", value: "serum" },
    { label: "Bọt (foam)", value: "foam" },
    { label: "Lotion", value: "lotion" },
];

export default function ProductDetailDialog({
    product,
    isOpen,
    onClose,
}: ProductDetailDialogProps) {
    // State tổng hợp cho toàn bộ form
    const [form, setForm] = useState(() => ({
        name: product?.name || "",
        brand: product?.brand || "",
        description: product?.description || "",
        ingredients: product?.ingredients || [],
        skinConcerns: product?.skinConcerns || [],
        suitableForSkinTypes: product?.suitableForSkinTypes || [],
        isActive: product?.isActive ?? true,
                        skus: product?.skus?.map((sku: ISku) => ({
                    _id: sku._id,
                    variantName: sku.variantName,
                    price: sku.price,
                    stock: sku.stock,
                    discount: sku.discount,
                    status: sku.status,
                    formulationType: sku.formulationType,
                })) || [],
    }));

    const updateProductMutation = useUpdateProductMutation();
    const updateSkuMutation = useUpdateSkuMutation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [addSkuOpen, setAddSkuOpen] = useState(false);
    const getProductDetailMutation = useGetProductDetailMutation();
    const deleteSkuMutation = useDeleteProductSkuMutation();
    useEffect(() => {
        if (addSkuOpen && scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [addSkuOpen]);

    useEffect(() => {
        if (getProductDetailMutation.data) {
            const newProduct = getProductDetailMutation.data;
            setForm({
                name: newProduct?.name,
                brand: newProduct?.brand,
                description: newProduct?.description,
                ingredients: newProduct?.ingredients || [],
                skinConcerns: newProduct?.skinConcerns || [],
                suitableForSkinTypes: newProduct?.suitableForSkinTypes || [],
                isActive: newProduct?.isActive ?? true,
                skus: newProduct?.skus?.map((sku: ISku) => ({
                    _id: sku._id,
                    variantName: sku.variantName,
                    price: sku.price,
                    stock: sku.stock,
                    discount: sku.discount,
                    status: sku.status,
                    formulationType: sku.formulationType,
                })) || [],
            });
        }
    }, [getProductDetailMutation.data]);

    // Reset lại form mỗi khi product thay đổi
    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                brand: product.brand || "",
                description: product.description || "",
                ingredients: product.ingredients || [],
                skinConcerns: product.skinConcerns || [],
                suitableForSkinTypes: product.suitableForSkinTypes || [],
                isActive: product.isActive ?? true,
                skus: product.skus?.map((sku: ISku) => ({
                    _id: sku._id,
                    variantName: sku.variantName,
                    price: sku.price,
                    stock: sku.stock,
                    discount: sku.discount,
                    status: sku.status,
                    formulationType: sku.formulationType,
                })) || [],
            });
        }
    }, [product]);

    const handleSave = async () => {
        // So sánh product
        const productChanged =
            form.name !== product?.name ||
            form.brand !== product?.brand ||
            form.description !== product?.description ||
            JSON.stringify(form.ingredients) !== JSON.stringify(product?.ingredients) ||
            JSON.stringify(form.skinConcerns) !== JSON.stringify(product?.skinConcerns) ||
            JSON.stringify(form.suitableForSkinTypes) !== JSON.stringify(product?.suitableForSkinTypes) ||
            form.isActive !== product?.isActive;

        // So sánh từng sku
        const skuChangedList = form.skus?.map((sku: ISku) => {
            const oldSku = product?.skus?.find((s: ISku) => s._id === sku._id);
            if (
                !oldSku ||
                sku.variantName !== oldSku.variantName ||
                sku.price !== oldSku.price ||
                sku.stock !== oldSku.stock ||
                sku.discount !== oldSku.discount ||
                sku.status !== oldSku.status ||
                sku.formulationType !== oldSku.formulationType
            ) {
                return sku;
            }
            return null;
        })
            .filter(Boolean);

        const promises: Promise<any>[] = [];

        if (productChanged) {
            promises.push(
                updateProductMutation.mutateAsync({
                    id: product?._id || '',
                    payload: {
                        name: form.name,
                        brand: form.brand,
                        description: form.description,
                        ingredients: form.ingredients,
                        skinConcerns: form.skinConcerns,
                        suitableForSkinTypes: form.suitableForSkinTypes,
                        isActive: form.isActive,
                    },
                })
            );
        }

        skuChangedList.forEach((sku: ISku) => {
            const { _id, ...rest } = sku;
            promises.push(
                updateSkuMutation.mutateAsync({
                    id: _id,
                    payload: rest,
                })
            );
        });

        await Promise.all(promises);
        onClose();
    };

    const handleDeleteSku = async (skuId: string) => {
        if (product) {
            await deleteSkuMutation.mutateAsync(skuId);
            getProductDetailMutation.mutate(product._id || '');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <div className="text-lg font-bold">Chi tiết sản phẩm</div>
                    </DialogTitle>
                </DialogHeader>
                {!product ? (
                    <div className="flex justify-center items-center h-40">
                        <span>Đang tải dữ liệu sản phẩm...</span>
                    </div>
                ) : (
                    <div className="flex p-2">
                        <div className="w-1/2 pl-3">
                            <div className="grid grid-cols-1 border-r border-gray-400 pr-10">
                                {/* LEFT: Product info */}
                                <div className="space-y-2">
                                    <div>
                                        <Label htmlFor="name">Tên sản phẩm</Label>
                                        <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                    </div>
                                    <div>
                                        <Label htmlFor="brand">Thương hiệu</Label>
                                        <Input id="brand" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Mô tả</Label>
                                        <Textarea id="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                    </div>

                                    <div className="divide-y divide-border">
                                        {/* Thành phần */}
                                        <div className="flex py-1 gap-4">
                                            <div className="min-w-[120px] font-semibold text-sm">Thành phần</div>
                                            <div className="flex text-sm text-muted-foreground">
                                                {form.ingredients?.join(", ") || "—"}
                                            </div>
                                            <div className="flex items-center justify-end flex-1">
                                                <EditDetailList
                                                    value={form.ingredients}
                                                    onChange={vals => setForm(f => ({ ...f, ingredients: vals }))}
                                                />
                                            </div>
                                        </div>
                                        {/* Vấn đề da */}
                                        <div className="flex py-1 gap-4">
                                            <div className="min-w-[120px] font-semibold text-sm">Vấn đề da</div>
                                            <div className="text-sm text-muted-foreground">
                                                {form.skinConcerns?.join(", ") || "—"}
                                            </div>
                                            <div className="flex items-center justify-end flex-1">
                                                <EditDetailList
                                                    value={form.skinConcerns}
                                                    onChange={vals => setForm(f => ({ ...f, skinConcerns: vals }))}
                                                />
                                            </div>
                                        </div>
                                        {/* Loại da phù hợp */}
                                        <div className="flex py-1 gap-4">
                                            <div className="min-w-[120px] font-semibold text-sm pt-1">Dành cho da</div>
                                            <div className="flex flex-wrap gap-2">
                                                {skinTypeOptions.map((option) => (
                                                    <CheckboxBadge
                                                        key={option.value}
                                                        title={option.label}
                                                        checked={form.suitableForSkinTypes.includes(option.value)}
                                                        onCheckedChange={checked => {
                                                            setForm(f => ({
                                                                ...f,
                                                                suitableForSkinTypes: checked
                                                                    ? [...f.suitableForSkinTypes, option.value]
                                                                    : f.suitableForSkinTypes.filter(t => t !== option.value)
                                                            }));
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {/* Trạng thái */}
                                        <div className="flex py-1 gap-4">
                                            <div className="min-w-[120px] font-semibold text-sm">Trạng thái</div>
                                            <div className="text-sm">
                                                <StatusToggleBadge
                                                    initialStatus={form.isActive}
                                                    onChange={newStatus => setForm(f => ({ ...f, isActive: newStatus }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* RIGHT: SKU list */}
                        <div className="pl-10 space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold">Danh sách SKU</div>
                                <Button className="bg-[color:var(--tertiary)] text-white hover:bg-red-300 hover:text-white" variant="outline" onClick={() => {
                                    if (!addSkuOpen) setAddSkuOpen(true);
                                }}>Thêm SKU</Button>
                            </div>
                            <div className="max-h-[420px] overflow-y-auto space-y-2 super-thin-scrollbar pr-2" ref={scrollRef}>
                                {form.skus.map((sku: ISku, idx: number) => {
                                    return (
                                        <div key={sku._id || sku.localId} className="p-2 border rounded-none space-y-2 bg-white">
                                            <div className="flex justify-between items-start">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label>Phiên bản</Label>
                                                        <Input value={sku.variantName} readOnly />
                                                    </div>
                                                    <div>
                                                        <Label>Loại bột</Label>
                                                        <select
                                                            className="w-full border rounded px-2 py-2 text-sm"
                                                            value={sku.formulationType}
                                                            onChange={e => {
                                                                const newSkus = [...form.skus];
                                                                newSkus[idx].formulationType = e.target.value;
                                                                setForm(f => ({ ...f, skus: newSkus }));
                                                            }}
                                                        >
                                                            {formulationTypeOptions.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label>Giá</Label>
                                                    <Input type="number" value={sku.price} onChange={e => {
                                                        const newSkus = [...form.skus];
                                                        newSkus[idx].price = Number(e.target.value);
                                                        setForm(f => ({ ...f, skus: newSkus }));
                                                    }} />
                                                </div>
                                                <div>
                                                    <Label>Tồn kho</Label>
                                                    <Input type="number" value={sku.stock} onChange={e => {
                                                        const newSkus = [...form.skus];
                                                        newSkus[idx].stock = Number(e.target.value);
                                                        setForm(f => ({ ...f, skus: newSkus }));
                                                    }} />
                                                </div>
                                                <div>
                                                    <Label>Giảm giá (%)</Label>
                                                    <Input type="number" value={sku.discount} onChange={e => {
                                                        const newSkus = [...form.skus];
                                                        newSkus[idx].discount = Number(e.target.value);
                                                        setForm(f => ({ ...f, skus: newSkus }));
                                                    }} />
                                                </div>
                                                <div>
                                                    <Label>Trạng thái</Label>
                                                    <select
                                                        className="w-full border rounded px-2 py-2 text-sm"
                                                        value={sku.status}
                                                        onChange={e => {
                                                            const newSkus = [...form.skus];
                                                            newSkus[idx].status = e.target.value;
                                                            setForm(f => ({ ...f, skus: newSkus }));
                                                        }}
                                                    >
                                                        <option value="active">Đang bán</option>
                                                        <option value="near_expiry">Sắp hết hạn</option>
                                                        <option value="returned">Đã trả</option>
                                                        <option value="hidden">Đã ẩn</option>
                                                        <option value="discontinued">Ngừng bán</option>
                                                    </select>
                                                </div>
                                                <SkuImagesUpload sku={sku} />
                                                <Button className="h-8 bg-[color:var(--tertiary)] text-white hover:bg-red-300 hover:text-white" variant="outline" onClick={() => handleDeleteSku(sku._id!)}>Xóa</Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <AddSkuDialog
                                isOpen={addSkuOpen}
                                onClose={() => setAddSkuOpen(false)}
                                productId={product._id || ''}
                                onSuccess={() => {
                                    setAddSkuOpen(false);
                                    getProductDetailMutation.mutate(product._id || '');
                                }}
                            />
                        </div>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button className="bg-[color:var(--tertiary)] hover:bg-red-300" onClick={handleSave}>
                        Lưu thay đổi
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
