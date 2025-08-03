import { Upload } from "antd";
import AntImage from "@/components/ui/antImage";
import Icon from "@/components/assests/icons";
import { useUploadSkuImages, useDeletedSkuImages } from "@/tanstack/product";
import { useState, useEffect } from "react";
import { ISku } from "@/types/product";
import type { UploadFile } from "antd/es/upload/interface";
import type { UploadFileStatus } from "antd/es/upload/interface";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    UploadValidation 
} from "@/types/upload";

interface SkuImagesUploadProps {
    sku: ISku;
    onImagesChange?: () => void;
}

function SkuImagesUpload({ sku, onImagesChange }: SkuImagesUploadProps) {
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
    const uploadMutation = useUploadSkuImages();
    const deletedMutation = useDeletedSkuImages();
    const [open, setOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");

    // Đồng bộ fileList với dữ liệu từ API
    useEffect(() => {
        if (sku.images && Array.isArray(sku.images) && sku.images.length > 0) {
            const newFileList: UploadFile<any>[] = sku.images.map((url: string, idx: number) => ({
                uid: `existing-${idx}`,
                name: `image${idx}`,
                status: "done" as UploadFileStatus,
                url,
            }));
            setFileList(newFileList);
        } else {
            setFileList([]);
        }
    }, [sku.images, sku._id]);

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

    const handleRemove = async (file: UploadFile<any>) => {
        try {
            if (file.uid.startsWith('existing-')) {
                const imageIndex = parseInt(file.uid.split('-')[1]);
                await deletedMutation.mutateAsync({ skuId: sku._id, imageIndex });
                setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
            } else {
                setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
            }
            onImagesChange?.();
        } catch (error) {
            console.error("Remove error:", error);
            // Cập nhật file với trạng thái error nếu xóa thất bại
            setFileList((prev) => 
                prev.map(f => 
                    f.uid === file.uid 
                        ? { ...f, status: "error" as UploadFileStatus }
                        : f
                )
            );
        }
        return true;
    };

    const validateFile = (file: File): UploadValidation => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            return { isValid: false, error: 'Chỉ chấp nhận file ảnh!' };
        }
        
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            return { isValid: false, error: 'File phải nhỏ hơn 5MB!' };
        }
        
        return { isValid: true };
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

    const isLoading = uploadMutation.isPending || deletedMutation.isPending;

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
                <Button variant="outline" size="sm" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                            <span className="text-xs">Đang xử lý...</span>
                        </div>
                    ) : (
                        <Icon name="imagePlus" size={16} />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Hình ảnh sản phẩm</DialogTitle>
                </DialogHeader>
                <div className="py-2">
                    <div className="mb-2 text-sm text-gray-600">
                        {fileList.length > 0 ? `${fileList.length} ảnh` : 'Chưa có ảnh'}
                        {isLoading && (
                            <span className="ml-2 text-blue-600">
                                • Đang xử lý...
                            </span>
                        )}
                    </div>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        disabled={isLoading}
                        beforeUpload={(file) => {
                            const validation = validateFile(file);
                            if (!validation.isValid) {
                                console.error(validation.error);
                                return false;
                            }
                            return true;
                        }}
                        customRequest={({ file, onSuccess, onError, onProgress }) => {
                            const f = file as File;
                            // Thêm file vào fileList với trạng thái uploading
                            const uploadingFile: UploadFile<any> = {
                                uid: `uploading-${Date.now()}`,
                                name: f.name,
                                status: "uploading" as UploadFileStatus,
                                percent: 0,
                            };
                            setFileList((prev) => [...prev, uploadingFile]);

                            // Simulate progress với Ant Design style
                            let progress = 0;
                            const progressInterval = setInterval(() => {
                                progress += Math.random() * 20;
                                if (progress > 95) {
                                    clearInterval(progressInterval);
                                    return;
                                }
                                setFileList((prev) => 
                                    prev.map(f => 
                                        f.uid === uploadingFile.uid 
                                            ? { ...f, percent: Math.min(progress, 95) } as UploadFile<any>
                                            : f
                                    )
                                );
                                // Call onProgress để Ant Design hiển thị progress
                                onProgress?.({ percent: Math.min(progress, 95) });
                            }, 300);

                            uploadMutation.mutate(
                                { skuId: sku._id, files: [f] },
                                {
                                    onSuccess: (updatedSku) => {
                                        clearInterval(progressInterval);
                                        const newUrl = updatedSku.images[updatedSku.images.length - 1];
                                        const doneFile: UploadFile<any> = {
                                            uid: `new-${Date.now()}`,
                                            name: f.name,
                                            status: "done" as UploadFileStatus,
                                            url: newUrl,
                                        };
                                        setFileList((prev) => [
                                            ...prev.filter(f => f.uid !== uploadingFile.uid),
                                            doneFile,
                                        ]);
                                        onSuccess?.("ok");
                                        onImagesChange?.();
                                    },
                                    onError: () => {
                                        clearInterval(progressInterval);
                                        // Cập nhật file với trạng thái error thay vì xóa
                                        setFileList((prev) => 
                                            prev.map(f => 
                                                f.uid === uploadingFile.uid 
                                                    ? { ...f, status: "error" as UploadFileStatus }
                                                    : f
                                            )
                                        );
                                        onError?.(new Error("Upload failed"));
                                    },
                                }
                            );
                        }}
                        showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                        }}
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
                            afterOpenChange: (visible) => { 
                                if (!visible) {
                                    setPreviewImage("");
                                }
                            },
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