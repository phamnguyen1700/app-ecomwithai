"use client";

import CustomTable from "@/components/common/CustomTable";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useAllUser, useUpdateRoleMutation } from "@/tanstack/user";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UserTable() {
  const [userData, setUserData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  
  const { data: users } = useAllUser({
    page: 1,
    limit: 1000,
  });
  
  const updateRoleMutationHook = useUpdateRoleMutation();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredUsers = userData.filter((user) => {
    // Role filter
    const roleMatch = activeTab === "all" || user.role === activeTab;
    
    // Search filter (name, email)
    const searchMatch = !searchTerm || 
      (user.fullname && user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Additional role filter
    const additionalRoleMatch = roleFilter === "all" || user.role === roleFilter;
    
    return roleMatch && searchMatch && additionalRoleMatch;
  });

  // Pagination logic
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset về trang 1 khi đổi tab
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role === "admin" ? "user" : "admin");
    setUpdateRoleDialogOpen(true);
  };

  const confirmUpdateRole = () => {
    if (!selectedUser) return;
    
    updateRoleMutationHook.mutate(
      { userId: selectedUser._id!, role: newRole },
      {
        onSuccess: () => {
          setUpdateRoleDialogOpen(false);
          setSelectedUser(null);
          // Refetch data
          window.location.reload();
        },
      }
    );
  };

  useEffect(() => {
    if (users?.data) {
      setUserData(users.data);
    }
  }, [users?.data]);


  const columns = [
    {
      colName: "Người dùng",
      render: (user: User) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <div className="text-xs font-medium text-gray-900 truncate max-w-[150px]">
              {user.fullname || "Chưa có tên"}
            </div>
          </div>
        </div>
      ),
    },
    {
      colName: "Email",
      render: (user: User) => <div className="text-xs text-left truncate max-w-[200px]">{user.email}</div>,
    },
    {
      colName: "Vai trò",
      render: (user: User) => (
        <Badge
          variant={user.role === "admin" ? "default" : "secondary"}
          className={`text-xs w-full justify-center whitespace-nowrap ${
            user.role === "admin" ? "bg-pink-400 text-white hover:bg-pink-500" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {user.role === "admin" ? "Admin" : "User"}
        </Badge>
      ),
    },
    {
      colName: "Trạng thái",
      render: (user: User) => (
        <Badge
          variant={user.isVerified ? "default" : "secondary"}
          className={`text-xs w-full justify-center whitespace-nowrap ${
            user.isVerified ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
        </Badge>
      ),
    },
    {
      colName: "Thao tác",
      render: (user: User) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleUpdateRole(user);
          }}
          disabled={updateRoleMutationHook.isPending}
          className="text-xs h-6 px-2 w-full justify-center"
        >
          {updateRoleMutationHook.isPending ? "Đang cập nhật..." : "Đổi vai trò"}
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Filters */}
      <div className="mb-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
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

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-4">
        <TabsList className="w-full flex">
          <TabsTrigger value="all" className="flex-1">Tất cả</TabsTrigger>
          <TabsTrigger value="admin" className="flex-1">Admin</TabsTrigger>
          <TabsTrigger value="user" className="flex-1">User</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <CustomTable columns={columns} records={paginatedUsers || []} />
      
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

      {/* Update Role Dialog */}
      <Dialog open={updateRoleDialogOpen} onOpenChange={setUpdateRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi vai trò người dùng</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">
                  Người dùng: <span className="font-medium">{selectedUser.fullname || selectedUser.email}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Vai trò hiện tại: <Badge variant="outline">{selectedUser.role === "admin" ? "Admin" : "User"}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Vai trò mới:</label>
                <Select value={newRole} onValueChange={(value: "admin" | "user") => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setUpdateRoleDialogOpen(false)}
                  disabled={updateRoleMutationHook.isPending}
                >
                  Hủy
                </Button>
                <Button
                  onClick={confirmUpdateRole}
                  disabled={updateRoleMutationHook.isPending}
                >
                  {updateRoleMutationHook.isPending ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 