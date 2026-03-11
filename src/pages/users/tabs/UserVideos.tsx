import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usersApi } from "@/api/usersApi";
import { motion, AnimatePresence } from "framer-motion";

interface StorageFile {
  name: string;
  fileName: string;
  path: string;
  downloadUrl: string;
  size: number;
  contentType: string;
  timeCreated: string;
}

export default function UserVideos({ userId }: { userId: string }) {
  const [videos, setVideos] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [playUrl, setPlayUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await usersApi.getUserFiles(userId, "videos");
        setVideos(res.data.files || []);
      } catch { toast.error("Failed to load videos"); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  const formatSize = (bytes: number) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
  };

  const downloadAll = () => {
    if (videos.length === 0) {
      toast.error("No videos to download");
      return;
    }
    
    toast.success(`Starting download of ${videos.length} videos...`);
    
    videos.forEach((vid, index) => {
      setTimeout(() => {
        // Force download by adding response-content-disposition parameter
        const downloadUrl = vid.downloadUrl + '&response-content-disposition=attachment';
        window.open(downloadUrl, '_blank');
      }, index * 1000);
    });
    
    setTimeout(() => {
      toast.success(`${videos.length} videos downloaded - check your downloads folder!`);
    }, videos.length * 1000 + 500);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (videos.length === 0) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200"
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <svg className="w-20 h-20 mx-auto text-purple-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </motion.div>
      <p className="text-purple-600 text-lg font-semibold">No videos found</p>
      <p className="text-purple-400 text-sm mt-1">This user has no videos in storage</p>
    </motion.div>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{videos.length} Videos</p>
            <p className="text-xs text-gray-500">Click to play</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((vid, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-2xl border-2 border-gray-200 overflow-hidden shadow-md hover:shadow-2xl transition-all bg-white">
              <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => setPlayUrl(vid.downloadUrl)}>
                <video src={vid.downloadUrl} className="w-full h-full object-cover" preload="metadata" />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 via-black/30 to-transparent group-hover:from-black/50 transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-2xl"
                  >
                    <svg className="w-7 h-7 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </motion.div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate mb-1">{vid.fileName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">{formatSize(vid.size)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-xs text-purple-600 font-semibold">Video</span>
                    </div>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    href={vid.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-3 p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl transition shadow-sm"
                    title="Download"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {playUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur flex items-center justify-center p-4"
            onClick={() => setPlayUrl(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-6 right-6 flex gap-3 z-10"
            >
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={playUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 backdrop-blur hover:bg-white/20 rounded-full p-3 transition"
                title="Download"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/10 backdrop-blur hover:bg-white/20 rounded-full p-3 transition"
                onClick={() => setPlayUrl(null)}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
            <motion.video
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={playUrl}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
