import dayjs from "dayjs";
import { useAllUser } from "@/tanstack/user";

export const useUserActivityChart = () => {
    const { data, isLoading } = useAllUser();

    const chartData: { day: string; users: number }[] = [];

    if (data?.data) {
        data.data.forEach((user: any) => {
            const day = dayjs(user.createdAt).format("ddd");

            const existing = chartData.find((item) => item.day === day);
            if (existing) {
                existing.users += 1;
            } else {
                chartData.push({ day, users: 1 });
            }
        });
    }

    return { data: chartData, isLoading };
};
