"use client";

import CustomTable from "@/components/common/CustomTable";
import { IOrder } from "@/types/order";
import { formatMoney } from "@/hooks/formatMoney";
import { formatDateToDisplay } from "@/hooks/formatDateToDisplay";
import { useEffect, useState } from "react";
import OrderDetailDialog from "./orderDetailDialog";
import { useAllOrder } from "@/tanstack/order";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllUser } from "@/tanstack/user";
import { User } from "@/types/user";
import { ORDER_STATUS_LABELS } from "@/constants/label";
import { Badge } from "@/components/ui/badge";
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

export default function OrderTable() {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [open, setOpen] = useState(false);
    const [orderData, setOrderData] = useState<IOrder[]>([]);
    const [usersData, setUsersData] = useState<User[]>([]);
    const allOrderQuery = useAllOrder({
        page: 1,
        limit: 1000,
    });
    const orders = allOrderQuery.data;
    const { data: users } = useAllUser({
        page: 1,
        limit: 1000,
    });
    const [status, setStatus] = useState("Pending");
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [paymentFilter, setPaymentFilter] = useState<string>("all");
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    
    const filteredOrders = orderData.filter((order) => {
      // Status filter
      const statusMatch = order.orderStatus === status;
      
      // Search filter (ID, customer email)
      const customerEmail = usersData.find((user) => user._id === order.userId)?.email || "";
      const searchMatch = !searchTerm || 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date filter
      const dateMatch = !selectedDate || 
        order.createdAt.startsWith(selectedDate);
      
      // Payment filter
      const paymentMatch = paymentFilter === "all" ||
        (paymentFilter === "paid" && order.isPaid) ||
        (paymentFilter === "unpaid" && !order.isPaid);
      
      return statusMatch && searchMatch && dateMatch && paymentMatch;
    });

    // Pagination logic
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setCurrentPage(1); // Reset về trang 1 khi đổi status
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (orders?.data && users?.data) {
            setOrderData(orders.data);
            setUsersData(users.data);
        }
    }, [orders, users]);

    const handleRowClick = (order: IOrder) => {
        setSelectedOrder(order);
        setOpen(true);
    };

    const columns = [
        {
            colName: "Mã Đơn",
            render: (order: IOrder) => <div className="text-xs text-left truncate max-w-[190px]">{order._id}</div>,
        },
        {
            colName: "Khách Hàng",
            render: (order: IOrder) => <div className="text-xs text-left truncate max-w-[200px]">{usersData.find((user) => user._id === order.userId)?.email || "—"}</div>,
        },
        {
            colName: "Tổng Tiền",
            render: (order: IOrder) => (
                <div className="text-xs text-center whitespace-nowrap">{formatMoney(order.totalAmount)}</div>
            ),
        },
        {
            colName: "Thanh Toán",
            render: (order: IOrder) => (
                <div className="text-xs text-center whitespace-nowrap">
                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </div>
            ),
        },
        {
            colName: "Trạng Thái",
            render: (order: IOrder) => {
                let variant: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" = "default";
                switch (order.orderStatus) {
                    case "Pending":
                        variant = "warning";
                        break;
                    case "Shipped":
                        variant = "outline";
                        break;
                    case "Delivered":
                        variant = "success";
                        break;
                    case "Cancelled":
                        variant = "destructive";
                        break;
                    default:
                        variant = "default";
                }
                return (
                    <Badge variant={variant} className="w-full justify-center whitespace-nowrap">
                        {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                    </Badge>
                );
            },
        },
        {
            colName: "Ngày đặt",
            render: (order: IOrder) => (
                <div className="text-xs text-center whitespace-nowrap">{formatDateToDisplay(order.createdAt)}</div>
            ),
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
                    placeholder="Tìm theo ID hoặc email khách hàng..."
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

                {/* Payment Filter */}
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={status} onValueChange={handleStatusChange} className="w-full mb-4">
                <TabsList className="w-full flex">
                    <TabsTrigger value="Pending" className="flex-1">Đang chờ</TabsTrigger>
                    <TabsTrigger value="Shipped" className="flex-1">Đang giao</TabsTrigger>
                    <TabsTrigger value="Delivered" className="flex-1">Đã giao</TabsTrigger>
                    <TabsTrigger value="Cancelled" className="flex-1">Đã hủy</TabsTrigger>
                </TabsList>
            </Tabs>
            <CustomTable columns={columns} records={paginatedOrders || []} onRowClick={handleRowClick} />
            
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
            <OrderDetailDialog
                usersData={usersData}
                order={selectedOrder}
                isOpen={open}
                onClose={() => setOpen(false)}
                onDeliverySuccess={() => {
                  allOrderQuery.refetch();
                }}
            />
        </>
    );
}
