"use client";

import ProductTable from "./productComponents/productTable";
import { useState } from "react";
import ProductAddnewDialog from "./productComponents/productAddnewDialog";

export default function ProductPage() {
  const [openAdd, setOpenAdd] = useState(false);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--text-color)]">Danh sách sản phẩm</h1>
        <button
          className="px-4 py-2 bg-[color:var(--tertiary)] text-white rounded-md hover:bg-red-300"
          onClick={() => setOpenAdd(true)}
        >
          Thêm sản phẩm
        </button>
      </div>
      <ProductTable />
      <ProductAddnewDialog isOpen={openAdd} onClose={() => setOpenAdd(false)} />
    </div>
  );
}
