"use client";

import UserTable from "./userPageComponents/userTable";

export default function UserPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--text-color)]">Danh sách người dùng</h1>
      </div>
      <UserTable />
    </div>
  );
} 