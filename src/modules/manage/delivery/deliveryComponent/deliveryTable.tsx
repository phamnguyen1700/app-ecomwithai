"use client";

import CustomTable from "@/components/common/CustomTable";
import { useDeliveries } from "@/tanstack/delivery";
import { useDeliveryPersonnelQuery } from "@/tanstack/delivery";
import { useEffect, useState } from "react";
import { Delivery } from "@/types/delievery";
import { formatDateToDisplay } from "@/hooks/formatDateToDisplay";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveryDetailDialog from "./deliveryDetailDialog";

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  pending: "Đang chờ",
  assigned: "Đã phân công",
  out_for_delivery: "Đang giao",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
  failed: "Thất bại",
};

export default function DeliveryTable() {
  const [deliveryData, setDeliveryData] = useState<Delivery[]>([]);
  const statusOptions = [
    { label: 'Đơn giao', value: 'pending' },
    { label: 'Xuất kho', value: 'out_for_delivery' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Thất bại', value: 'failed' },
  ];
  const [status, setStatus] = useState<string>(statusOptions[0].value);
  const deliveriesQuery = useDeliveries({ page: 1, limit: 10 });
  const data = deliveriesQuery.data;
  const { data: deliveryPersonnelData } = useDeliveryPersonnelQuery({ page: 1, limit: 50 });

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    if (data?.data) setDeliveryData(data.data);
  }, [data]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    deliveriesQuery.refetch();
  };

  const filteredDeliveries = status === 'pending'
    ? deliveryData.filter((delivery) => delivery.status === 'pending' || delivery.status === 'assigned')
    : deliveryData.filter((delivery) => delivery.status === status);

  const columns = [
    {
      colName: "Mã Giao Hàng",
      render: (delivery: Delivery) => <div className="text-xs text-left cursor-pointer underline" onClick={() => { setSelectedDelivery(delivery); setOpenDetail(true); }}>{delivery._id}</div>,
    },
    {
      colName: "Khách Hàng",
      render: (delivery: Delivery) => <div className="text-xs text-left">{delivery.shippingAddress.fullName}</div>,
    },
    {
      colName: "Shipper",
      render: (delivery: Delivery) => {
        if (delivery.status === 'pending' || !delivery.deliveryPersonnelId) {
          return (
            <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-500 font-semibold">Chưa phân công</span>
          );
        }
        const personnel = deliveryPersonnelData?.data?.find((p: any) => p._id === delivery.deliveryPersonnelId);
        const personnelEmail = personnel?.email || delivery.deliveryPersonnelId || 'Không có';
        return (
          <span className="bg-blue-600 rounded px-2 py-1 text-xs text-white font-semibold">{personnelEmail}</span>
        );
      },
    },
    {
      colName: "Địa chỉ",
      render: (delivery: Delivery) => <div className="text-xs text-left">{delivery.shippingAddress.street}, {delivery.shippingAddress.city}</div>,
    },
    {
      colName: "Phí giao",
      render: (delivery: Delivery) => <div className="text-xs text-center">{delivery.deliveryFee?.toLocaleString("vi-VN")}₫</div>,
    },
    {
      colName: "Trạng Thái",
      render: (delivery: Delivery) => {
        let variant: "default" | "warning" | "success" | "destructive" | "outline" = "default";
        switch (delivery.status) {
          case "pending":
            variant = "warning";
            break;
          case "processing":
          case "assigned":
          case "out_for_delivery":
            variant = "outline";
            break;
          case "delivered":
            variant = "success";
            break;
          case "cancelled":
          case "failed":
            variant = "destructive";
            break;
          default:
            variant = "default";
        }
        return (
          <Badge variant={variant} className="w-full justify-center">
            {DELIVERY_STATUS_LABELS[delivery.status] || delivery.status}
          </Badge>
        );
      },
    },
    {
      colName: "Ngày tạo",
      render: (delivery: Delivery) => <div className="text-xs text-center">{formatDateToDisplay(delivery.createdAt)}</div>,
    },
  ];

  return (
    <>
      <Tabs value={status} onValueChange={handleStatusChange} className="w-full mb-4">
        <TabsList className="w-full flex">
          {statusOptions.map(opt => (
            <TabsTrigger key={opt.value} value={opt.value} className="flex-1">{opt.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <CustomTable
        columns={columns}
        records={filteredDeliveries}
        onRowClick={(delivery) => {
          setSelectedDelivery(delivery);
          setOpenDetail(true);
        }}
      />
      <DeliveryDetailDialog
        delivery={openDetail ? selectedDelivery : null}
        open={openDetail && !!selectedDelivery}
        onClose={() => setOpenDetail(false)}
        deliveryPersonnelData={deliveryPersonnelData?.data}
      />
    </>
  );
}
