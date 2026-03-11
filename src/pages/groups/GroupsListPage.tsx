import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { groupsApi } from "@/api/groupsApi";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { format } from "date-fns";

export default function GroupsListPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination(20);
  const navigate = useNavigate();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await groupsApi.getAll({ search: debouncedSearch, page: pagination.page, limit: pagination.limit });
      setGroups(res.data.groups || []);
      pagination.setTotal(res.data.total || 0);
    } catch { toast.error("Failed to fetch groups"); }
    finally { setLoading(false); }
  }, [debouncedSearch, pagination.page]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await groupsApi.delete(deleteTarget.id || deleteTarget._id);
      toast.success("Group deleted");
      setDeleteTarget(null);
      fetchGroups();
    } catch { toast.error("Failed to delete"); }
  };

  const columns = [
    {
      header: "Group",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          {row.pictureUrl ? (
            <img src={row.pictureUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {(row.name || "G")[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.channelId || ""}</p>
          </div>
        </div>
      ),
    },
    { header: "Members", cell: (row: any) => <span className="font-semibold">{row.members?.length || 0}</span> },
    { header: "Created", cell: (row: any) => <span className="text-sm text-gray-500">{row.createdAt ? format(new Date(row.createdAt), "dd MMM yyyy") : "-"}</span> },
    { header: "Last Activity", cell: (row: any) => <span className="text-sm text-gray-500">{row.lastMessageTime ? format(new Date(row.lastMessageTime), "dd MMM, HH:mm") : "-"}</span> },
    {
      header: "Actions",
      cell: (row: any) => (
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); navigate(`/groups/${row.id || row._id}`); }}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">View</button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
            className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Groups ({pagination.total})</h1>
      <div className="mb-6 w-full sm:w-80">
        <SearchBar value={search} onChange={setSearch} placeholder="Search groups..." />
      </div>
      <DataTable columns={columns} data={groups} page={pagination.page} totalPages={pagination.totalPages}
        total={pagination.total} onPageChange={pagination.setPage} isLoading={loading} />
      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Group"
        message={`Delete group "${deleteTarget?.name}"? All messages will be lost.`}
        confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
