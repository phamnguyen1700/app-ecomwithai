// components/OrderDetailModal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useOrderDetail } from "@/tanstack/order";

export const OrderDetailModal = ({ orderId, open, onOpenChange }: any) => {
    const { data, isLoading } = useOrderDetail(orderId);    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="text-center py-6">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        <div>Mã đơn hàng: {data?.data?._id}</div>
                        <div>Trạng thái: {data?.data?.orderStatus}</div>
                        <div>Phương thức thanh toán: {data?.data?.paymentMethod}</div>
                        <div>
                            Tổng tiền:{" "}
                            {data?.data?.totalAmount.toLocaleString("vi-VN")}₫
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Sản phẩm:</h4>
                            <ul className="space-y-2">
                                {data?.data?.items.map((item: any, i: number) => (
                                    <li
                                        key={i}
                                        className="border p-2 rounded-md"
                                    >
                                        <div>{item.skuName}</div>
                                        <div>Số lượng: {item.quantity}</div>
                                        <div>
                                            Giá:{" "}
                                            {item.priceSnapshot?.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </div>
                                        <div>
                                            Giảm giá: {item.discountSnapshot}%
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
