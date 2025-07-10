"use client";
import { renderUserList } from "@/components/common/userList";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAddressByCityStats } from "@/hooks/useAddressByCityStats";
import { Skeleton } from "antd";
import React, { useState } from "react";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#00C49F",
    "#FF8042",
];
const AddressPage = () => {
    const { stats, isLoading } = useAddressByCityStats();
    const [activeCity, setActiveCity] = useState<string | null>(null);
    return (
        <div className="p-6">
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">
                    📊 Phân bố địa chỉ theo thành phố
                </h2>

                {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats}
                                    dataKey="count"
                                    nameKey="city"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(
                                            0
                                        )}%)`
                                    }
                                    onMouseEnter={(_, index) =>
                                        setActiveCity(stats[index].city)
                                    }
                                    onMouseLeave={() => setActiveCity(null)}
                                >
                                    {stats.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(
                                        value: number,
                                        _name: string,
                                        _props: any
                                    ) => [`${value}`, "Số lượng"]}
                                    labelFormatter={(label) =>
                                        `Thành phố: ${label}`
                                    }
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Danh sách user chi tiết */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-base mb-2">
                                🧑 Danh sách người dùng theo thành phố
                            </h3>
                            <ScrollArea className="h-60 border rounded-md p-4">
                                {activeCity
                                    ? renderUserList(
                                          activeCity,
                                          stats.find(
                                              (item) => item.city === activeCity
                                          )?.users
                                      )
                                    : stats.map((item) =>
                                          renderUserList(item.city, item.users)
                                      )}
                            </ScrollArea>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default AddressPage;
