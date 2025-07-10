"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface Props {
    data: {
        _id: number;
        totalSales: number;
        count: number;
    }[];
}

export const MonthlySalesChart = ({ data }: Props) => {
    const formatted = data.map((item) => ({
        month: `Tháng ${item._id}`,
        totalSales: item.totalSales,
    }));

    return (
        <div className="p-4 border rounded-lg bg-white dark:bg-muted">
            <h2 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatted}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(1)}tr`} />
                    <Tooltip
                        formatter={(value: number) =>
                            `${value.toLocaleString("vi-VN")} ₫`
                        }
                    />
                    <Bar
                        dataKey="totalSales"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
