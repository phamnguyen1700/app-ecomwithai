"use client";
import { useDeliveries, useDeliveryDetail } from "@/tanstack/order";
import { Button, Descriptions, Modal, Spin, Table, Tag } from "antd";
import React, { useState } from "react";

const columns = (onViewDetail: (id: string) => void) => [
    {
        title: "Tên người nhận",
        dataIndex: ["shippingAddress", "fullName"],
        key: "fullName",
    },
    {
        title: "Số điện thoại",
        dataIndex: ["shippingAddress", "phone"],
        key: "phone",
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: string) => {
            const colorMap: Record<string, string> = {
                pending: "default",
                processing: "processing",
                assigned: "purple",
                out_for_delivery: "orange",
                delivered: "green",
                cancelled: "red",
                failed: "red",
            };
            return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
        },
    },
    {
        title: "Hành động",
        key: "action",
        render: (_: any, record: any) => (
            <Button onClick={() => onViewDetail(record._id)}>
                Xem chi tiết
            </Button>
        ),
    },
];

const Delivery = () => {
    const { data, isLoading } = useDeliveries({ page: 1, limit: 10 });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { data: detail, isLoading: loadingDetail, isError } = useDeliveryDetail(
        selectedId || undefined
    );
    const closeModal = () => setSelectedId(null);
    if (isLoading) return <Spin tip="Đang tải đơn giao hàng..." />;

    if (isError) return <div>Không thể tải dữ liệu giao hàng.</div>;
    if (isLoading)
        return (
            <div style={{ textAlign: "center", padding: "2rem" }}>
                <Spin tip="Đang tải đơn giao hàng..." />
            </div>
        );
    return (
        <div>
            <h2>Danh sách đơn giao hàng</h2>

            <Table
                dataSource={data?.data || []}
                columns={columns(setSelectedId)}
                rowKey="_id"
                pagination={{
                    total: data?.total || 0,
                    current: data?.page || 1,
                    pageSize: data?.limit || 10,
                }}
            />

            <Modal
                open={!!selectedId}
                title="Chi tiết giao hàng"
                onCancel={closeModal}
                footer={null}
            >
                {loadingDetail ? (
                    <Spin />
                ) : (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Tên người nhận">
                            {detail?.shippingAddress?.fullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {detail?.shippingAddress?.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">
                            {`${detail?.shippingAddress?.street}, ${detail?.shippingAddress?.city}, ${detail?.shippingAddress?.country}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {detail?.status}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tracking Number">
                            {detail?.trackingNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label="Cần ký nhận?">
                            {detail?.requiresSignature ? "Có" : "Không"}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default Delivery;
