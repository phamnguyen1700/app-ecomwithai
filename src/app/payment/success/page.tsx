"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Thanh toán thành công!");
    const timer = setTimeout(() => {
      router.push("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center text-lg font-semibold">
      Đang xử lý đơn hàng...
    </div>
  );
}
