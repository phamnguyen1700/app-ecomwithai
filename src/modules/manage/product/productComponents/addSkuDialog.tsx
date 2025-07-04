import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateProductSkuMutation } from "@/tanstack/product";
import { useState } from "react";
import { SkuStatus, SkuFormulationType } from "@/types/product";

interface AddSkuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: string;
}

export default function AddSkuDialog({ isOpen, onClose, onSuccess, productId }: AddSkuDialogProps) {
  const [sku, setSku] = useState({
    variantName: "",
    price: "",
    stock: "",
    discount: "",
    status: "active" as SkuStatus,
    images: [] as string[],
    formulationType: "" as SkuFormulationType,
  });
  const [error, setError] = useState("");
  const createSkuMutation = useCreateProductSkuMutation();

  const handleConfirm = async () => {
    if (!sku.variantName || !sku.price || !sku.stock || !sku.status || !sku.formulationType) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    setError("");
      await createSkuMutation.mutateAsync({
        productId,
        variantName: sku.variantName,
        price: Number(sku.price) || 0,
        stock: Number(sku.stock) || 0,
        discount: Number(sku.discount) || 0,
        status: sku.status as SkuStatus,
        formulationType: sku.formulationType as SkuFormulationType,
      });
      setSku({ variantName: "", price: "", stock: "", discount: "", status: "active" as SkuStatus, images: [], formulationType: "" as SkuFormulationType });
      onSuccess();

  };

  const isLoading = createSkuMutation.status === "pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm SKU mới</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Phiên bản</Label>
            <Input value={sku.variantName} onChange={e => setSku(s => ({ ...s, variantName: e.target.value }))} />
          </div>
          <div>
            <Label>Loại bột</Label>
            <select
              className="w-full border rounded px-2 py-2 text-sm"
              value={sku.formulationType}
              onChange={e => setSku(s => ({ ...s, formulationType: e.target.value as SkuFormulationType }))}
            >
              <option value="">Chọn loại</option>
              <option value="cream">Kem (cream)</option>
              <option value="gel">Gel</option>
              <option value="serum">Serum</option>
              <option value="foam">Bọt (foam)</option>
              <option value="lotion">Lotion</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Giá</Label>
            <Input
              type="number"
              value={sku.price}
              onChange={e => setSku(s => ({ ...s, price: e.target.value }))}
            />
          </div>
          <div>
            <Label>Tồn kho</Label>
            <Input type="number" value={sku.stock} onChange={e => setSku(s => ({ ...s, stock: e.target.value }))} />
          </div>
          <div>
            <Label>Giảm giá (%)</Label>
            <Input type="number" value={sku.discount} onChange={e => setSku(s => ({ ...s, discount: e.target.value }))} />
          </div>
          <div>
            <Label>Trạng thái</Label>
            <select
              className="w-full border rounded px-2 py-2 text-sm"
              value={sku.status}
              onChange={e => setSku(s => ({ ...s, status: e.target.value as SkuStatus }))}
            >
              <option value="active">Đang bán</option>
              <option value="near_expiry">Sắp hết hạn</option>
              <option value="returned">Đã trả</option>
              <option value="hidden">Đã ẩn</option>
              <option value="discontinued">Ngừng bán</option>
            </select>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="flex justify-end mt-2 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
          <Button className="bg-green-500 text-white hover:bg-green-600" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
