export interface Column<T> {
  colName: string;
  render: (record: T) => React.ReactNode;
}

export interface CustomTableProps<T> {
  columns: Column<T>[];
  records: T[];
} 