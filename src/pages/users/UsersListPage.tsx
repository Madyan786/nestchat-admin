import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { usersApi } from "@/api/usersApi";
import { useDebounce } from "@/hooks/useDebounce";
import SearchBar from "@/components/common/SearchBar";
import { motion } from "framer-motion";

interface FirebaseUser {
  _id: string;
  userId: string;
  displayName: string;
  phone: string;
}

export default function UsersListPage() {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebounce(search, 400);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll({ search: debouncedSearch, page: 1, limit: 200 });
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch { toast.error("Failed to fetch users"); }
    finally { setLoading(false); }
  }, [debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header with gradient */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Users
              </span>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
              >
                {total}
              </motion.span>
            </h1>
            <p className="text-gray-500">Manage Firebase Storage users</p>
          </div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"
          />
          <div className="relative">
            <SearchBar value={search} onChange={setSearch} placeholder="🔍 Search by user ID..." />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-400 font-medium">Loading users...</p>
        </motion.div>
      ) : users.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-200"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.div>
          <p className="text-gray-500 text-lg font-medium">No users found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((user, idx) => (
            <motion.div
              key={user._id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/users/${user.userId}`)}
              className="relative cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-md hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-lg"
                  >
                    {user.userId.startsWith("+") ? user.userId.slice(-2) : user.userId.substring(0, 2).toUpperCase()}
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {user.userId}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-xs text-gray-500">
                        {user.userId.startsWith("+") ? "Phone" : "Firebase UID"}
                      </p>
                    </div>
                  </div>
                  <motion.svg
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
