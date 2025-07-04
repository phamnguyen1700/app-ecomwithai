"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomTableProps, Column } from "@/types/table";

export default function CustomTable<T>({
  columns,
  records,
  onRowClick,
}: CustomTableProps<T> & { onRowClick?: (record: T) => void }) {
  return (
    <div className="border border-gray-300 rounded-none overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow className="border-b border-gray-400 bg-[color:var(--tertiary)] hover:bg-[color:var(--tertiary)]">
            {columns.map((col: Column<T>, index: number) => (
              <TableHead
                key={index}
                className="px-4 py-2 text-center text-xs font-semibold text-white"
              >
                {col.colName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {records?.length > 0 ? (
            records?.map((record: T, rowIndex: number) => (
              <TableRow
                key={rowIndex}
                className="border-b border-gray-400 h-12 group text-[color:var(--text-color)] hover:bg-[color:var(--secondary)] cursor-pointer"
                onClick={() => onRowClick?.(record)}
              >
                {columns.map((col: Column<T>, colIndex: number) => (
                  <TableCell key={colIndex} className="text-xs px-4 py-2 group-hover:bg-[color:var(--secondary)]">
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