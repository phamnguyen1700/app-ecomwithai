import { Upload } from "antd";
import AntImage from "@/components/ui/antImage";
import Icon from "@/components/assests/icons";
import { useUploadSkuImages, useDeletedSkuImages } from "@/tanstack/product";
import { useState } from "react";
import { ISku } from "@/types/product";
import type { UploadFile } from "antd/es/upload/interface";
import type { UploadFileStatus } from "antd/es/upload/interface";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

function SkuImagesUpload({ sku }: { sku: ISku }) {
    const [fileList, setFileList] = useState<UploadFile<any>[]>(
        (sku.images || []).map((url: string, idx: number) => ({
            uid: String(idx),
            name: `image${idx}`,
            status: "done" as UploadFileStatus,
            url,
        }))
    );
    const uploadMutation = useUploadSkuImages();
    const deletedMutation = useDeletedSkuImages();
    const [open, setOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");



    const handlePreview = async (file: UploadFile<any>) => {
        if (!file.url && !file.preview && file.originFileObj) {
            const reader = new FileReader();
            file.preview = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result as string);
                if (file.originFileObj) {
                    reader.readAsDataURL(file.originFileObj);
                }
            });
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = (file: UploadFile<any>) => {
        deletedMutation.mutate({ skuId: sku._id, imageIndex: Number(file.uid) });
        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
        return true;
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                width: '100%',
                height: '100%',
            }}
            type="button"
        >
            <Icon name="imagePlus" size={16} />
            <div style={{ marginTop: 4, fontSize: 11 }}>Upload</div>
        </button>
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (open && previewOpen && !nextOpen) {
                    setPreviewOpen(false);
                    setPreviewImage("");
                    return;
                }
                setOpen(nextOpen);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Icon name="imagePlus" size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Hình ảnh sản phẩm</DialogTitle>
                </DialogHeader>
                <div className="py-2">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        customRequest={({ file, onSuccess }) => {
                            const f = file as File;
                            uploadMutation.mutate(
                                { skuId: sku._id, files: [f] },
                                {
                                    onSuccess: (updatedSku) => {
                                        const newUrl = updatedSku.images[updatedSku.images.length - 1];
                                        setFileList((prev) => [
                                            ...prev,
                                            {
                                                uid: String(Date.now()),
                                                name: f.name,
                                                status: "done",
                                                url: newUrl,
                                            },
                                        ]);
                                        onSuccess?.("ok");
                                    },
                                    onError: () => {
                                        toast.error("Tải ảnh thất bại!");
                                    },
                                }
                            );
                        }}
                        showUploadList={true}
                        onRemove={handleRemove}
                        onPreview={handlePreview}
                        itemRender={(originNode) => (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    borderRadius: 8,
                                    background: '#fff',
                                }}
                            >
                                {originNode}
                            </div>
                        )}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </div>
                {previewOpen && (
                    <AntImage
                        style={{ display: "none" }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: setPreviewOpen,
                            afterOpenChange: (visible) => { if (!visible) setPreviewImage(""); },
                            getContainer: () => document.body,
                        }}
                        src={previewImage}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

export default SkuImagesUpload;
