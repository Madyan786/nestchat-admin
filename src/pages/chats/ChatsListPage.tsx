import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/axiosInstance";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import AvatarWithStatus from "@/components/common/AvatarWithStatus";
import { format } from "date-fns";

export default function ChatsListPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination(20);
  const navigate = useNavigate();

  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (debouncedSearch) p.append("search", debouncedSearch);
      const res = await api.get(`/api/admin/chats?${p}`);
      setChats(res.data.chats || []);
      pagination.setTotal(res.data.total || 0);
    } catch { toast.error("Failed to fetch chats"); }
    finally { setLoading(false); }
  }, [debouncedSearch, pagination.page]);

  useEffect(() => { fetchChats(); }, [fetchChats]);

  const columns = [
    {
      header: "Participants",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <AvatarWithStatus src={row.participant1?.avatarUrl} name={row.participant1?.displayName || "User 1"} size="sm" />
            <AvatarWithStatus src={row.participant2?.avatarUrl} name={row.participant2?.displayName || "User 2"} size="sm" />
          </div>
          <div>
            <p className="text-sm font-medium">{row.participant1?.displayName || "User"} & {row.participant2?.displayName || "User"}</p>
            <p className="text-xs text-gray-400">{row.participant1?.phone} - {row.participant2?.phone}</p>
          </div>
        </div>
      ),
    },
    { header: "Messages", cell: (row: any) => <span className="font-semibold text-gray-700">{row.messageCount || 0}</span> },
    {
      header: "Last Message",
      cell: (row: any) => (
        <div className="max-w-[200px]">
          <p className="text-sm text-gray-600 truncate">{row.lastMessage?.content || "-"}</p>
          <p className="text-xs text-gray-400">{row.lastMessage?.type || ""}</p>
        </div>
      ),
    },
    {
      header: "Last Activity",
      cell: (row: any) => (
        <span className="text-sm text-gray-500">
          {row.lastMessage?.createdAt ? format(new Date(row.lastMessage.createdAt), "dd MMM, HH:mm") : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row: any) => (
        <button onClick={(e) => { e.stopPropagation(); navigate(`/chats/${row.id || row._id}`); }}
          className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">View Messages</button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Chats ({pagination.total})</h1>
      <div className="mb-6 w-full sm:w-80">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by user name or phone..." />
      </div>
      <DataTable columns={columns} data={chats} page={pagination.page} totalPages={pagination.totalPages}
        total={pagination.total} onPageChange={pagination.setPage} isLoading={loading}
        onRowClick={(row) => navigate(`/chats/${row.id || row._id}`)} />
    </div>
  );
}
