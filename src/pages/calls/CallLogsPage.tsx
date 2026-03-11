import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { callsApi } from "@/api/callsApi";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import AvatarWithStatus from "@/components/common/AvatarWithStatus";
import StatusBadge from "@/components/common/StatusBadge";
import type { CallLog } from "@/types/call";
import { format } from "date-fns";

export default function CallLogsPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [search, setSearch] = useState("");
  const [callType, setCallType] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination(20);

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callsApi.getAll({ search: debouncedSearch, callType, status, page: pagination.page, limit: pagination.limit });
      setCalls(res.data.calls || []);
      pagination.setTotal(res.data.total || 0);
    } catch { toast.error("Failed to fetch calls"); }
    finally { setLoading(false); }
  }, [debouncedSearch, callType, status, pagination.page]);

  useEffect(() => { fetchCalls(); }, [fetchCalls]);

  const formatDuration = (sec?: number) => {
    if (!sec) return "-";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const columns = [
    {
      header: "Caller",
      cell: (row: CallLog) => (
        <div className="flex items-center gap-3">
          <AvatarWithStatus src={row.callerAvatar} name={row.callerName} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.callerName}</p>
            <p className="text-xs text-gray-500">{row.callerPhone}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Receiver",
      cell: (row: CallLog) => (
        <div className="flex items-center gap-3">
          <AvatarWithStatus src={row.receiverAvatar} name={row.receiverName} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.receiverName}</p>
            <p className="text-xs text-gray-500">{row.receiverPhone}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      cell: (row: CallLog) => (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${row.callType === "video" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={row.callType === "video" ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" : "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"} />
          </svg>
          {row.callType}
        </span>
      ),
    },
    { header: "Status", cell: (row: CallLog) => <StatusBadge status={row.status} /> },
    { header: "Duration", cell: (row: CallLog) => <span className="font-mono text-sm">{formatDuration(row.duration)}</span> },
    { header: "Time", cell: (row: CallLog) => <span className="text-sm text-gray-500">{row.startTime ? format(new Date(row.startTime), "dd MMM, HH:mm") : "-"}</span> },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Call Logs ({pagination.total})</h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-80"><SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone..." /></div>
        <select value={callType} onChange={(e) => setCallType(e.target.value)} className="px-4 py-3 border rounded-lg bg-white text-sm">
          <option value="">All Types</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-3 border rounded-lg bg-white text-sm">
          <option value="">All Status</option>
          <option value="answered">Answered</option>
          <option value="missed">Missed</option>
          <option value="rejected">Rejected</option>
          <option value="ended">Ended</option>
        </select>
      </div>
      <DataTable columns={columns} data={calls} page={pagination.page} totalPages={pagination.totalPages}
        total={pagination.total} onPageChange={pagination.setPage} isLoading={loading} />
    </div>
  );
}
