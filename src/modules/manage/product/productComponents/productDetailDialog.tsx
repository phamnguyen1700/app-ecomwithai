"use client";

import { IProduct } from "@/types/product";
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
import Icon from "@/components/assests/icons";
import StatusToggleBadge from "@/components/common/statusToggleBadge";
import CheckboxBadge from "@/components/common/checkboxBadge";
import EditDetailList from "@/components/common/editDetailList";

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

export default function ProductDetailDialog({
    product,
    isOpen,
    onClose,
}: ProductDetailDialogProps) {
    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle asChild>
                        <div className="text-lg font-bold">Chi tiết sản phẩm</div>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex p-2">
                    <div className="w-1/2 pl-3">
                        <div className="grid grid-cols-1 border-r border-gray-400 pr-10">
                            {/* LEFT: Product info */}
                            <div className="space-y-2">
                                <div>
                                    <Label htmlFor="name">Tên sản phẩm</Label>
                                    <Input id="name" defaultValue={product.name} />
                                </div>
                                <div>
                                    <Label htmlFor="brand">Thương hiệu</Label>
                                    <Input id="brand" defaultValue={product.brand} />
                                </div>
                                <div>
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea id="description" defaultValue={product.description} />
                                </div>

                                <div className="divide-y divide-border">
                                    {/* Thành phần */}
                                    <div className="flex py-1 gap-4">
                                        <div className="min-w-[120px] font-semibold text-sm">Thành phần</div>
                                        <div className="flex text-sm text-muted-foreground">
                                            {product.ingredients?.join(", ") || "—"}
                                        </div>
                                        <div className="flex items-center justify-end flex-1">

                                            <EditDetailList
                                                initialValues={product.ingredients || []}
                                            // onChange={setIngredients}
                                            />
                                        </div>
                                    </div>
                                    {/* Vấn đề da */}
                                    <div className="flex py-1 gap-4">
                                        <div className="min-w-[120px] font-semibold text-sm">Vấn đề da</div>
                                        <div className="text-sm text-muted-foreground">
                                            {product.skinConcerns?.join(", ") || "—"}
                                        </div>
                                        <div className="flex items-center justify-end flex-1">
                                            <EditDetailList
                                                initialValues={product.skinConcerns || []}
                                            // onChange={setIngredients}
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
                                                    checked={product.suitableForSkinTypes?.includes(option.value)}
                                                    onCheckedChange={(checked: boolean) => {
                                                        const updated = checked
                                                            ? [...(product.suitableForSkinTypes || []), option.value]
                                                            : (product.suitableForSkinTypes || []).filter((t) => t !== option.value);
                                                        console.log("Cập nhật loại da:", updated);
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
                                                initialStatus={product.isActive}
                                                onChange={(newStatus) => {
                                                    console.log("Trạng thái mới:", newStatus);
                                                    // Gọi API cập nhật nếu cần
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    {/* RIGHT: SKU list */}
                    <div className="pl-10 space-y-2">
                        <div className="font-semibold">Danh sách SKU</div>
                        <div className="max-h-[420px] overflow-y-auto space-y-2 super-thin-scrollbar">
                            {product.skus?.map((sku) => (
                                <div key={sku._id} className="p-2 border rounded-none space-y-2 bg-white">
                                    <div>
                                        <Label>Phiên bản</Label>
                                        <Input defaultValue={sku.variantName} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>Giá</Label>
                                            <Input type="number" defaultValue={sku.price} />
                                        </div>
                                        <div>
                                            <Label>Tồn kho</Label>
                                            <Input type="number" defaultValue={sku.stock} />
                                        </div>
                                        <div>
                                            <Label>Giảm giá (%)</Label>
                                            <Input type="number" defaultValue={sku.discount} />
                                        </div>
                                        <div>
                                            <Label>Trạng thái</Label>
                                            <Input defaultValue={sku.status} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button className="bg-[color:var(--tertiary)] hover:bg-red-300">
                        Lưu thay đổi
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
