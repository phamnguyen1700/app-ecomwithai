"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderChartData } from "@/hooks/useOrderChartData";
import { useUserActivityChart } from "@/hooks/useUserActivityChart";
import { useAllOrder, useAnalytics } from "@/tanstack/order";
import { useProducts } from "@/tanstack/product";
import { useAllUser } from "@/tanstack/user";
import { Bar, Line } from "recharts";
import {
    BarChart,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
    const { data: getUsers, isLoading: isLoadingUsers } = useAllUser();
    const { data: getproducts, isLoading: isLoadingProducts } = useProducts();
    const { data: getAnalytics, isLoading: isLoadingAnalytics } =
        useAnalytics();
    const { data: ordersChartData } = useOrderChartData();
    const { data: getOrders } = useAllOrder();
    const { data: userActivityData } = useUserActivityChart();

    const recentOrders = (getOrders?.data || []).slice(0, 5).map((order) => ({
        id: order._id,
        date: new Date(order.createdAt).toLocaleDateString(),
        status: order.orderStatus || order.paymentStatus,
    }));

    const totalUsers = getUsers?.data?.length || 0;
    const totalProducts = getproducts?.data?.length || 0;
    const totalOrders = getAnalytics?.totalOrders || 0;
    const totalRevenue = getAnalytics?.totalRevenue || 0;
    const stats = [
        { label: "Total Users", value: isLoadingUsers ? "..." : totalUsers },
        {
            label: "Total Orders",
            value: isLoadingAnalytics ? "..." : totalOrders,
        },
        { label: "Revenue", value: isLoadingAnalytics ? "..." : totalRevenue },
        {
            label: "Total Products",
            value: isLoadingProducts ? "..." : totalProducts,
        },
    ];
    const iconMap = ["👤", "📦", "💰", "🛒"];
    const orderStatusStats = (getOrders?.data || []).reduce((acc, order) => {
        const status = order.orderStatus || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const statusColorMap: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };
    return (
        <div className="p-8 grid gap-10 max-w-screen-xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="bg-muted/50 shadow-sm rounded-2xl hover:shadow-md transition-shadow"
                    >
                        <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
                            <div className="text-3xl">{iconMap[index]}</div>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500">
                                {stat.label}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-2xl shadow-md">
                    <CardContent className="h-64">
                        <h3 className="font-semibold text-lg text-gray-700 mb-4">
                            Orders
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ordersChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-md">
                    <CardContent>
                        <h3 className="font-semibold text-lg text-gray-700 mb-4">
                            Recent Orders
                        </h3>
                        <ul className="space-y-2">
                            {recentOrders.map((order) => (
                                <li
                                    key={order.id}
                                    className="flex justify-between items-center py-1 border-b last:border-none"
                                >
                                    <span className="text-gray-600">
                                        {order.id.slice(-6)}
                                    </span>
                                    <span>{order.date}</span>
                                    <span
                                        className={`text-sm px-2 py-0.5 rounded-full capitalize ${
                                            statusColorMap[
                                                order.status.toLowerCase()
                                            ] || "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-2xl shadow-md">
                    <CardContent>
                        <h3 className="font-semibold text-lg text-gray-700 mb-4">
                            Order Status
                        </h3>
                        <ul className="space-y-2">
                            {Object.entries(orderStatusStats).map(
                                ([status, count]) => (
                                    <li
                                        key={status}
                                        className="flex justify-between items-center py-1 border-b last:border-none"
                                    >
                                        <span className="capitalize text-gray-600">
                                            {status}
                                        </span>
                                        <span className="text-sm font-semibold bg-gray-100 rounded-md px-2 py-0.5">
                                            {count}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-md">
                    <CardContent className="h-64">
                        <h3 className="font-semibold text-lg text-gray-700 mb-4">
                            User Activity
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={userActivityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="users" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
