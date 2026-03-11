import React from "react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({ columns, data, page, totalPages, total, onPageChange, isLoading = false, onRowClick }: {
  columns: Column<T>[]; data: T[]; page: number; totalPages: number; total: number;
  onPageChange: (p: number) => void; isLoading?: boolean; onRowClick?: (row: T) => void;
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">No data found</td></tr>
            ) : (
              data.map((row, ri) => (
                <tr key={ri} className={`hover:bg-gray-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`} onClick={() => onRowClick?.(row)}>
                  {columns.map((col, ci) => (
                    <td key={ci} className="px-6 py-4 text-sm text-gray-700">
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? "-") : "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
        <p className="text-sm text-gray-500">
          Showing {Math.min((page - 1) * 20 + 1, total)} to {Math.min(page * 20, total)} of {total}
        </p>
        <div className="flex gap-2">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
            className="px-3 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-white">Previous</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, page - 2) + i;
            if (p > totalPages) return null;
            return (
              <button key={p} onClick={() => onPageChange(p)}
                className={`px-3 py-2 text-sm rounded-lg ${p === page ? "bg-blue-600 text-white" : "border hover:bg-white"}`}>{p}</button>
            );
          })}
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
            className="px-3 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-white">Next</button>
        </div>
      </div>
    </div>
  );
}
