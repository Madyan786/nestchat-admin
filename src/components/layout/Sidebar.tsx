import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

const menuItems = [
  { path: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { path: "/users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const admin = useAuthStore((s) => s.admin);

  return (
    <>
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 min-h-screen flex flex-col transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo Section with gradient */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-gray-800/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          <div className="relative flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <span className="text-white font-bold text-lg">N</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">NestChat</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation with animations */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <NavLink key={item.path} to={item.path} end={item.path === "/"} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden ${isActive ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"}`
              }>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
                    className="relative z-10"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </motion.div>
                  <span className="text-sm font-semibold relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white ml-auto relative z-10"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin Profile with gradient */}
        {admin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 border-t border-gray-800/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
            <div className="relative flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg"
              >
                {admin.name?.[0] || "A"}
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{admin.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                  />
                  <p className="text-xs text-gray-400 truncate capitalize">{admin.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </aside>
    </>
  );
}
