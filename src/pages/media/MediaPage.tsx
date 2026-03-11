import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { mediaApi } from "@/api/mediaApi";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import SearchBar from "@/components/common/SearchBar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DownloadButton from "@/components/common/DownloadButton";
import { formatFileSize } from "@/utils/exportHelper";
import { exportAllMediaToExcel } from "@/utils/exportHelper";
import type { MediaItem, MediaType } from "@/types/media";
import { format } from "date-fns";

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaType | "">("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination(20);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mediaApi.getAll({ type: typeFilter || undefined, search: debouncedSearch, page: pagination.page, limit: pagination.limit });
      setMedia(res.data.media || []);
      pagination.setTotal(res.data.total || 0);
    } catch { toast.error("Failed to fetch media"); }
    finally { setLoading(false); }
  }, [debouncedSearch, typeFilter, pagination.page]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await mediaApi.delete(deleteTarget.id || deleteTarget._id || "");
      toast.success("Media deleted");
      setDeleteTarget(null);
      fetchMedia();
    } catch { toast.error("Failed to delete"); }
  };

  const typeIcons: Record<string, string> = {
    image: "🖼️", video: "🎬", voice: "🎵", file: "📄", document: "📋",
  };

  const renderThumbnail = (item: MediaItem) => {
    if (item.fileType === "image") {
      return <img src={item.storedUrl} alt="" className="w-full h-40 object-cover rounded-lg" />;
    }
    if (item.fileType === "video") {
      return (
        <div className="w-full h-40 bg-gray-900 rounded-lg flex items-center justify-center">
          <span className="text-4xl">🎬</span>
        </div>
      );
    }
    return (
      <div className="w-full h-40 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
        <span className="text-4xl">{typeIcons[item.fileType] || "📁"}</span>
        <span className="text-xs text-gray-500 uppercase">{item.fileType}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media ({pagination.total})</h1>
        <div className="flex gap-2">
          <button onClick={() => exportAllMediaToExcel(media)} className="px-4 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100">Export Excel</button>
          <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            {viewMode === "grid" ? "List View" : "Grid View"}
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-80"><SearchBar value={search} onChange={setSearch} placeholder="Search media..." /></div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="px-4 py-3 border rounded-lg bg-white text-sm">
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="voice">Voice</option>
          <option value="file">Files</option>
          <option value="document">Documents</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No media found</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id || item._id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition group">
              {renderThumbnail(item)}
              <div className="p-3">
                <p className="text-sm font-medium truncate">{item.originalName || "Untitled"}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{formatFileSize(item.fileSize)}</span>
                  <span className="text-xs text-gray-400">{item.createdAt ? format(new Date(item.createdAt), "dd MMM") : ""}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">By: {item.uploaderName || "Unknown"}</p>
                <div className="flex gap-2 mt-3">
                  <DownloadButton url={item.storedUrl} fileName={item.originalName || "file"} />
                  <button onClick={() => setDeleteTarget(item)}
                    className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">File</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Type</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Size</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Uploader</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {media.map((item) => (
                <tr key={item.id || item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{item.originalName || "Untitled"}</td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">{item.fileType}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(item.fileSize)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.uploaderName || "Unknown"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy") : "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <DownloadButton url={item.storedUrl} fileName={item.originalName || "file"} />
                      <button onClick={() => setDeleteTarget(item)} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</p>
        <div className="flex gap-2">
          <button onClick={() => pagination.setPage(pagination.page - 1)} disabled={pagination.page <= 1}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40">Previous</button>
          <button onClick={() => pagination.setPage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40">Next</button>
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Media"
        message={`Delete "${deleteTarget?.originalName}"? This cannot be undone.`}
        confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
