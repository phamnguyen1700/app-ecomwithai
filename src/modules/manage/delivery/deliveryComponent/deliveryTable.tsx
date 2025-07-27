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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  
  const deliveriesQuery = useDeliveries({ page: 1, limit: 1000 });
  const data = deliveriesQuery.data;
  const { data: deliveryPersonnelData } = useDeliveryPersonnelQuery({ page: 1, limit: 1000 });

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    if (data?.data) setDeliveryData(data.data);
  }, [data]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1); // Reset về trang 1 khi đổi status
    deliveriesQuery.refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredDeliveries = deliveryData.filter((delivery) => {
    // Status filter
    const statusMatch = status === 'pending' 
      ? (delivery.status === 'pending' || delivery.status === 'assigned')
      : delivery.status === status;
    
    // Search filter (ID, customer name)
    const searchMatch = !searchTerm || 
      delivery._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    const dateMatch = !selectedDate || 
      delivery.createdAt.startsWith(selectedDate);
    
    // Assignment filter
    const assignmentMatch = assignmentFilter === "all" ||
      (assignmentFilter === "assigned" && delivery.deliveryPersonnelId) ||
      (assignmentFilter === "unassigned" && !delivery.deliveryPersonnelId);
    
    return statusMatch && searchMatch && dateMatch && assignmentMatch;
  });

  // Pagination logic
  const totalItems = filteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  const columns = [
    {
      colName: "Mã Giao Hàng",
      render: (delivery: Delivery) => <div className="text-xs text-left cursor-pointer underline truncate max-w-[120px]" onClick={() => { setSelectedDelivery(delivery); setOpenDetail(true); }}>{delivery._id}</div>,
    },
    {
      colName: "Khách Hàng",
      render: (delivery: Delivery) => <div className="text-xs text-left truncate max-w-[150px]">{delivery.shippingAddress.fullName}</div>,
    },
    {
      colName: "Shipper",
      render: (delivery: Delivery) => {
        if (delivery.status === 'pending' || !delivery.deliveryPersonnelId) {
          return (
            <span className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-500 font-semibold whitespace-nowrap">Chưa phân công</span>
          );
        }
        const personnel = deliveryPersonnelData?.data?.find((p: any) => p._id === delivery.deliveryPersonnelId);
        const personnelEmail = personnel?.email || delivery.deliveryPersonnelId || 'Không có';
        return (
          <span className="bg-blue-600 rounded px-2 py-1 text-xs text-white font-semibold truncate max-w-[120px] block">{personnelEmail}</span>
        );
      },
    },
    {
      colName: "Địa chỉ",
      render: (delivery: Delivery) => <div className="text-xs text-left truncate max-w-[200px]">{delivery.shippingAddress.street}, {delivery.shippingAddress.city}</div>,
    },
    {
      colName: "Phí giao",
      render: (delivery: Delivery) => <div className="text-xs text-center whitespace-nowrap">{delivery.deliveryFee?.toLocaleString("vi-VN")}₫</div>,
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
          <Badge variant={variant} className="w-full justify-center whitespace-nowrap">
            {DELIVERY_STATUS_LABELS[delivery.status] || delivery.status}
          </Badge>
        );
      },
    },
    {
      colName: "Ngày tạo",
      render: (delivery: Delivery) => <div className="text-xs text-center whitespace-nowrap">{formatDateToDisplay(delivery.createdAt)}</div>,
    },
  ];

  return (
    <>
      {/* Filters */}
      <div className="mb-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm theo ID hoặc tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Date Filter */}
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full"
          />

          {/* Assignment Filter */}
          <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Phân công" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="assigned">Đã phân công</SelectItem>
              <SelectItem value="unassigned">Chưa phân công</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={status} onValueChange={handleStatusChange} className="w-full mb-4">
        <TabsList className="w-full flex">
          {statusOptions.map(opt => (
            <TabsTrigger key={opt.value} value={opt.value} className="flex-1">{opt.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <CustomTable
        columns={columns}
        records={paginatedDeliveries}
        onRowClick={(delivery) => {
          setSelectedDelivery(delivery);
          setOpenDetail(true);
        }}
      />
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* Page numbers */}
              {(() => {
                const maxVisiblePages = 5;
                const visiblePages = Math.min(maxVisiblePages, totalPages);
                
                return Array.from({ length: visiblePages }, (_, i) => {
                  let pageNum;
                  if (totalPages <= maxVisiblePages) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - maxVisiblePages + i + 1;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <DeliveryDetailDialog
        delivery={openDetail ? selectedDelivery : null}
        open={openDetail && !!selectedDelivery}
        onClose={() => setOpenDetail(false)}
        deliveryPersonnelData={deliveryPersonnelData?.data}
      />
    </>
  );
}
