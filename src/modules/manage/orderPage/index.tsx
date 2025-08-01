"use client";

import OrderTable from "./orderPageComponents/orderTable";

export default function OrderPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--text-color)]">Danh sách đơn hàng</h1>
      </div>
      <OrderTable />
    </div>
  );
}
