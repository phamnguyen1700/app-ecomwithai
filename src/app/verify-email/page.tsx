"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { get } from "@/util/Http";
import { toast } from "react-toastify";

const VerifyEmailInner = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus("error");
                toast.error("Thiếu mã xác thực.");
                return;
            }

            try {
                await get(`/user/verify-email/confirm?token=${token}`);
                setStatus("success");
                toast.success("Xác thực email thành công!");
                setTimeout(() => router.push("/"), 2000);
            } catch (err) {
                console.log(err);
                setStatus("error");
                toast.error("Xác thực thất bại hoặc token không hợp lệ.");
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="min-h-screen flex items-center justify-center flex-col text-center px-4">
            {status === "loading" && (
                <p className="text-lg">Đang xác thực email...</p>
            )}
            {status === "success" && (
                <>
                    <h1 className="text-2xl font-bold mb-4 text-green-300">
                        Xác thực thành công!
                    </h1>
                    <p className="text-muted-foreground">
                        Bạn sẽ được chuyển hướng trong giây lát.
                    </p>
                </>
            )}
            {status === "error" && (
                <>
                    <h1 className="text-2xl font-bold text-red-500 mb-4">
                        Xác thực thất bại
                    </h1>
                    <p className="text-muted-foreground">
                        Vui lòng kiểm tra lại đường dẫn xác thực.
                    </p>
                </>
            )}
        </div>
    );
};

const VerifyEmailPage = () => {
    return (
        <Suspense fallback={<p>Đang tải trang...</p>}>
            <VerifyEmailInner />
        </Suspense>
    );
};

export default VerifyEmailPage;
