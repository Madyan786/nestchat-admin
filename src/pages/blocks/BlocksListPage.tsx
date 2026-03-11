import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { blocksApi } from "@/api/blocksApi";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import DataTable from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import AvatarWithStatus from "@/components/common/AvatarWithStatus";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { BlockRecord } from "@/types/block";
import { format } from "date-fns";

export default function BlocksListPage() {
  const [blocks, setBlocks] = useState<BlockRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [unblockTarget, setUnblockTarget] = useState<BlockRecord | null>(null);
  const [unblocking, setUnblocking] = useState(false);
  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination(20);

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blocksApi.getAll(pagination.page, pagination.limit, debouncedSearch);
      setBlocks(res.data.blocks || []);
      pagination.setTotal(res.data.total || 0);
    } catch { toast.error("Failed to fetch blocks"); }
    finally { setLoading(false); }
  }, [debouncedSearch, pagination.page]);

  useEffect(() => { fetchBlocks(); }, [fetchBlocks]);

  const handleUnblock = async () => {
    if (!unblockTarget) return;
    setUnblocking(true);
    try {
      await blocksApi.forceUnblock(unblockTarget.blockerProfileId, unblockTarget.blockedProfileId);
      toast.success("Unblocked successfully");
      setUnblockTarget(null);
      fetchBlocks();
    } catch { toast.error("Failed to unblock"); }
    finally { setUnblocking(false); }
  };

  const columns = [
    {
      header: "Blocker",
      cell: (row: BlockRecord) => (
        <div className="flex items-center gap-3">
          <AvatarWithStatus src={row.blockerAvatar} name={row.blockerName || "Unknown"} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.blockerName || "Unknown"}</p>
            <p className="text-xs text-gray-500">{row.blockerPhone || ""}</p>
          </div>
        </div>
      ),
    },
    {
      header: "",
      cell: () => (
        <div className="text-center">
          <svg className="w-5 h-5 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      ),
    },
    {
      header: "Blocked",
      cell: (row: BlockRecord) => (
        <div className="flex items-center gap-3">
          <AvatarWithStatus src={row.blockedAvatar} name={row.blockedName || "Unknown"} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.blockedName || "Unknown"}</p>
            <p className="text-xs text-gray-500">{row.blockedPhone || ""}</p>
          </div>
        </div>
      ),
    },
    { header: "Date", cell: (row: BlockRecord) => <span className="text-sm text-gray-500">{row.createdAt ? format(new Date(row.createdAt), "dd MMM yyyy, HH:mm") : "-"}</span> },
    {
      header: "Actions",
      cell: (row: BlockRecord) => (
        <button onClick={(e) => { e.stopPropagation(); setUnblockTarget(row); }}
          className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium">Force Unblock</button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Block Records ({pagination.total})</h1>
      <div className="mb-6 w-full sm:w-80">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone..." />
      </div>
      <DataTable columns={columns} data={blocks} page={pagination.page} totalPages={pagination.totalPages}
        total={pagination.total} onPageChange={pagination.setPage} isLoading={loading} />
      <ConfirmDialog isOpen={!!unblockTarget} title="Force Unblock"
        message={`Force unblock "${unblockTarget?.blockedName}" blocked by "${unblockTarget?.blockerName}"?`}
        confirmLabel="Unblock" variant="warning" onConfirm={handleUnblock} onCancel={() => setUnblockTarget(null)} isLoading={unblocking} />
    </div>
  );
}
