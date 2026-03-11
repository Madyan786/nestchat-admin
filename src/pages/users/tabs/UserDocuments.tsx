import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usersApi } from "@/api/usersApi";
import { motion } from "framer-motion";

interface StorageFile {
  name: string;
  fileName: string;
  path: string;
  downloadUrl: string;
  size: number;
  contentType: string;
  timeCreated: string;
}

const docIcon = (name: string) => {
  const ext = name.split("?")[0].split(".").pop()?.toLowerCase() || "";
  if (["pdf"].includes(ext)) return { bg: "bg-red-50", text: "text-red-600", label: "PDF" };
  if (["doc", "docx"].includes(ext)) return { bg: "bg-blue-50", text: "text-blue-600", label: "DOC" };
  if (["xls", "xlsx"].includes(ext)) return { bg: "bg-green-50", text: "text-green-600", label: "XLS" };
  if (["ppt", "pptx"].includes(ext)) return { bg: "bg-orange-50", text: "text-orange-600", label: "PPT" };
  if (["zip", "rar", "7z"].includes(ext)) return { bg: "bg-yellow-50", text: "text-yellow-600", label: "ZIP" };
  if (["txt"].includes(ext)) return { bg: "bg-gray-50", text: "text-gray-600", label: "TXT" };
  if (["apk"].includes(ext)) return { bg: "bg-emerald-50", text: "text-emerald-600", label: "APK" };
  return { bg: "bg-purple-50", text: "text-purple-600", label: ext.toUpperCase() || "FILE" };
};

const formatSize = (bytes: number) => {
  if (!bytes) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
};

export default function UserDocuments({ userId }: { userId: string }) {
  const [docs, setDocs] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);

  const downloadAll = () => {
    if (docs.length === 0) {
      toast.error("No documents to download");
      return;
    }
    
    toast.success(`Starting download of ${docs.length} documents...`);
    
    docs.forEach((doc, index) => {
      setTimeout(() => {
        // Force download by adding response-content-disposition parameter
        const downloadUrl = doc.downloadUrl + '&response-content-disposition=attachment';
        window.open(downloadUrl, '_blank');
      }, index * 1000);
    });
    
    setTimeout(() => {
      toast.success(`${docs.length} documents downloaded - check your downloads folder!`);
    }, docs.length * 1000 + 500);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await usersApi.getUserFiles(userId, "documents");
        setDocs(res.data.files || []);
      } catch { toast.error("Failed to load documents"); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (docs.length === 0) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-200"
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <svg className="w-20 h-20 mx-auto text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </motion.div>
      <p className="text-amber-600 text-lg font-semibold">No documents found</p>
      <p className="text-amber-400 text-sm mt-1">This user has no documents in storage</p>
    </motion.div>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{docs.length} Documents</p>
            <p className="text-xs text-gray-500">Open or download</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {docs.map((doc, i) => {
          const icon = docIcon(doc.fileName);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="relative group"
            >
              <div className={`absolute inset-0 ${icon.bg} rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity`} />
              <div className="relative flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:shadow-lg transition-all">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 rounded-xl ${icon.bg} flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <span className={`text-sm font-bold ${icon.text}`}>{icon.label}</span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate mb-1">{doc.fileName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">{formatSize(doc.size)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className={`text-xs font-semibold ${icon.text}`}>{icon.label}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3 py-2 text-xs font-semibold ${icon.bg} ${icon.text} rounded-xl hover:shadow-md transition`}
                    title="Open"
                  >
                    Open
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={doc.downloadUrl}
                    download
                    className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition shadow-sm"
                    title="Download"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
