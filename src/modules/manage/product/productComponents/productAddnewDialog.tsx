import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import EditDetailList from "@/components/common/editDetailList";
import CheckboxBadge from "@/components/common/checkboxBadge";
import { useCreateProductMutation } from "@/tanstack/product";
import StatusToggleBadge from "@/components/common/statusToggleBadge";

const skinTypeOptions = [
  { label: "Da thường", value: "normal" },
  { label: "Da khô", value: "dry" },
  { label: "Da dầu", value: "oily" },
  { label: "Da hỗn hợp", value: "combination" },
  { label: "Da nhạy cảm", value: "sensitive" },
];

interface ProductAddnewDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductAddnewDialog({ isOpen, onClose }: ProductAddnewDialogProps) {
  const [form, setForm] = useState<{
    name: string;
    brand: string;
    description: string;
    ingredients: string[];
    skinConcerns: string[];
    suitableForSkinTypes: string[];
    isActive: boolean;
  }>({
    name: "",
    brand: "",
    description: "",
    ingredients: [],
    skinConcerns: [],
    suitableForSkinTypes: [],
    isActive: true,
  });

  const createProductMutation = useCreateProductMutation();

  const handleSave = () => {
    createProductMutation.mutate(form);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle asChild>
            <div className="text-lg font-bold">Thêm sản phẩm mới</div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-2">
          {/* LEFT: Product info */}
          <div className="pl-3">
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
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button className="bg-[color:var(--tertiary)] hover:bg-red-300" onClick={handleSave}>
            Lưu sản phẩm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
