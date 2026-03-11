import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi } from "@/api/usersApi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface StorageFolder {
  name: string;
}

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, storageRes] = await Promise.all([
          usersApi.getAll({ page: 1, limit: 1 }),
          usersApi.getStorageOverview(),
        ]);
        setTotalUsers(usersRes.data.total || 0);
        setFolders(storageRes.data.folders || []);
      } catch { toast.error("Failed to load dashboard"); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );

  const folderIcons: Record<string, { bg: string; text: string; icon: string }> = {
    chatImages: { bg: "bg-blue-50", text: "text-blue-600", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    whatsappImages: { bg: "bg-green-50", text: "text-green-600", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    whatsappDocuments: { bg: "bg-amber-50", text: "text-amber-600", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    whatsappVoices: { bg: "bg-purple-50", text: "text-purple-600", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
    whatsappAudio: { bg: "bg-pink-50", text: "text-pink-600", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" },
    userrecording: { bg: "bg-red-50", text: "text-red-600", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
    storyImages: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" },
    uploads: { bg: "bg-cyan-50", text: "text-cyan-600", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
    groupChatImages: { bg: "bg-teal-50", text: "text-teal-600", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  };
  const defaultIcon = { bg: "bg-gray-50", text: "text-gray-600", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header with gradient */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-20" />
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Firebase Storage Dashboard
              </h1>
              <p className="text-blue-100 text-lg">Real-time analytics and storage management</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards with gradients */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/users")}
          className="relative cursor-pointer group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
            </div>
            <motion.p
              key={totalUsers}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1"
            >
              {totalUsers}
            </motion.p>
            <p className="text-gray-600 font-medium">Total Users</p>
            <div className="mt-3 flex items-center text-xs text-blue-600 font-semibold">
              <span>View all</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03, y: -5 }} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>
            <motion.p
              key={folders.length}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent mb-1"
            >
              {folders.length}
            </motion.p>
            <p className="text-gray-600 font-medium">Storage Folders</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03, y: -5 }} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150" />
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">pulse-82887</p>
            <p className="text-gray-600 font-medium">Firebase Storage</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Storage Folders Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          Storage Folders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder, idx) => {
            const style = folderIcons[folder] || defaultIcon;
            return (
              <motion.div
                key={folder}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group cursor-pointer"
              >
                <div className={`absolute inset-0 ${style.bg} rounded-2xl blur opacity-50 group-hover:opacity-75 transition`} />
                <div className={`relative ${style.bg} rounded-2xl p-5 border-2 border-white shadow-md hover:shadow-xl transition`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <svg className={`w-6 h-6 ${style.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-bold text-sm ${style.text} mb-1 truncate`}>{folder}</p>
                      <p className="text-xs text-gray-500">Firebase path</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs ${style.text} font-semibold opacity-70`}>Active</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-5 h-5 rounded-lg ${style.text} opacity-50`}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
