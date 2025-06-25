import { useMutation } from "@tanstack/react-query";
import { checkout } from "@/zustand/services/checkout";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import { ICheckoutResponse } from "@/types/checkout";

export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: checkout,
    onSuccess: (response: AxiosResponse<ICheckoutResponse>) => {
      const url = response.data?.url;
      if (url) {
        window.location.href = url;
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
