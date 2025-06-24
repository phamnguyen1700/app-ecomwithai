import { useMutation } from "@tanstack/react-query";
import { checkout } from "@/zustand/services/checkout";
import { toast } from "react-toastify";

export const useCheckoutMutation = () => {
    return useMutation({
        mutationFn: checkout,
        onSuccess: (data) => {
            if (data?.url) {
              window.location.href = data.url;
            } else {
              toast.success("Tạo phiên thanh toán thành công!");
            }
          },
          onError: (error: any) => {
            toast.error("Thanh toán thất bại. Vui lòng thử lại!");
            console.error("Checkout error:", error);
          },
    });
};