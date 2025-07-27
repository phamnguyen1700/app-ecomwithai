import { post } from "@/util/Http";
import { useMutation } from "@tanstack/react-query";

export interface RefundPayload {
    orderId: string;
    amount: number;
    reason: string;
}

export const useRefundRequest = () => {
    return useMutation({
        mutationFn: (data: RefundPayload) => {
            return post("/refund/request", data);
        },
    });
};
