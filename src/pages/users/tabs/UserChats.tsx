import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usersApi } from "@/api/usersApi";

interface FileStats {
  images: number;
  videos: number;
  documents: number;
  voices: number;
}

interface StorageFile {
  name: string;
  fileName: string;
  path: string;
  downloadUrl: string;
  size: number;
}

export default function UserChats({ userId }: { userId: string }) {
  const [stats, setStats] = useState<FileStats | null>(null);
  const [groupFiles, setGroupFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [filesRes, groupRes] = await Promise.all([
          usersApi.getUserAllFiles(userId),
          usersApi.browsePath(`groupChatImages/${userId}/`).catch(() => ({ data: { files: [] } })),
        ]);
        setStats(filesRes.data.stats || null);
        setGroupFiles(groupRes.data.files || []);
      } catch { toast.error("Failed to load data"); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  const statCards = stats ? [
    { label: "Images", count: stats.images, color: "bg-blue-50 text-blue-600", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Videos", count: stats.videos, color: "bg-purple-50 text-purple-600", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { label: "Documents", count: stats.documents, color: "bg-amber-50 text-amber-600", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Voice/Audio", count: stats.voices, color: "bg-green-50 text-green-600", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
  ] : [];

  return (
    <div>
      {/* File Stats */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Storage Summary</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map((s, i) => (
          <div key={i} className={`rounded-xl p-4 ${s.color.split(" ")[0]} border`}>
            <div className="flex items-center gap-2 mb-2">
              <svg className={`w-5 h-5 ${s.color.split(" ")[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
              </svg>
              <span className={`text-xs font-medium ${s.color.split(" ")[1]}`}>{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Storage Paths */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Storage Paths</h4>
      <div className="space-y-2 mb-6">
        {[`chatImages/${userId}/`, `whatsappVoices/${userId}/`, `userrecording/${userId}/`, `storyImages/${userId}/`, `uploads/${userId}/`, `groupChatImages/${userId}/`].map((path, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-sm text-gray-600 font-mono truncate">{path}</span>
          </div>
        ))}
      </div>

      {/* Group Chat Images */}
      {groupFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Group Chat Files ({groupFiles.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {groupFiles.map((f, i) => (
              <a key={i} href={f.downloadUrl} target="_blank" rel="noreferrer"
                className="aspect-square rounded-xl overflow-hidden border bg-gray-100 hover:shadow-lg transition block">
                <img src={f.downloadUrl} alt={f.name} className="w-full h-full object-cover" loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
