"use client";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

export const showDeleteConfirm = (
    reviewId: string,
    onDelete: (id: string) => void
) => {
    confirm({
        title: "Bạn có chắc chắn muốn xoá đánh giá này?",
        icon: <ExclamationCircleOutlined />,
        content: "Thao tác này sẽ không thể hoàn tác.",
        okText: "Xoá",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
            onDelete(reviewId);
        },
    });
};
