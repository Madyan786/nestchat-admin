import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { usersApi } from "@/api/usersApi";
import { motion, AnimatePresence } from "framer-motion";
import UserContacts from "./tabs/UserContacts";
import UserChats from "./tabs/UserChats";
import UserImages from "./tabs/UserImages";
import UserVideos from "./tabs/UserVideos";
import UserDocuments from "./tabs/UserDocuments";
import UserVoices from "./tabs/UserVoices";

const tabs = [
  { key: "overview", label: "Overview", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { key: "profile", label: "Profile / Stories", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { key: "images", label: "Images", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "videos", label: "Videos", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { key: "documents", label: "Documents", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { key: "voices", label: "Voice / Audio", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
] as const;

type TabKey = typeof tabs[number]["key"];

interface UserStats {
  images: number;
  videos: number;
  documents: number;
  voices: number;
  totalFiles: number;
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await usersApi.getById(id);
        setStats(res.data.user?.stats || null);
      } catch { toast.error("User not found"); navigate("/users"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );
  if (!id) return null;

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <UserChats userId={id} />;
      case "profile": return <UserContacts userId={id} />;
      case "images": return <UserImages userId={id} />;
      case "videos": return <UserVideos userId={id} />;
      case "documents": return <UserDocuments userId={id} />;
      case "voices": return <UserVoices userId={id} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => navigate("/users")}
        className="text-gray-400 hover:text-blue-600 mb-6 flex items-center gap-2 text-sm font-medium group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Users
      </motion.button>

      {/* User Header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
        <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex items-center gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-2xl"
            >
              {id.startsWith("+") ? id.slice(-2) : id.substring(0, 2).toUpperCase()}
            </motion.div>
            <div className="min-w-0 flex-1">
              <h2 className="text-3xl font-extrabold text-gray-900 truncate mb-1">{id}</h2>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <p className="text-sm text-gray-500 font-medium">
                  {id.startsWith("+") ? "Phone number user" : "Firebase Auth UID"}
                </p>
              </div>
            </div>
          </div>
          
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative grid grid-cols-2 sm:grid-cols-5 gap-4"
            >
              {[
                { label: "Images", value: stats.images, gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
                { label: "Videos", value: stats.videos, gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
                { label: "Documents", value: stats.documents, gradient: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
                { label: "Voices", value: stats.voices, gradient: "from-green-500 to-green-600", bg: "bg-green-50" },
                { label: "Total", value: stats.totalFiles, gradient: "from-gray-500 to-gray-600", bg: "bg-gray-50" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`${stat.bg} rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all cursor-pointer`}
                >
                  <motion.p
                    key={stat.value}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-3xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-1`}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs font-semibold text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Tabs with animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden"
      >
        <div className="flex border-b-2 border-gray-100 overflow-x-auto bg-gradient-to-r from-gray-50 to-white">
          {tabs.map((tab, idx) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition whitespace-nowrap ${activeTab === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b-4 border-blue-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <svg className={`w-5 h-5 flex-shrink-0 relative z-10 ${activeTab === tab.key ? "text-blue-600" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
