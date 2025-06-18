"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomTableProps } from "@/types/table";

export default function CustomTable<T>({
  columns,
  records,
}: CustomTableProps<T>) {
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow className="border border-b-black bg-gray-100">
            {columns.map((col, index) => (
              <TableHead
                key={index}
                className="px-4 py-2 text-center text-xs font-semibold text-black"
              >
                {col.colName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {records.length > 0 ? (
            records.map((record, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-b h-16 group hover:bg-gray-200 transition"
              >
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className="text-xs px-4 py-2 group-hover:bg-gray-200">
                    {col.render(record)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 