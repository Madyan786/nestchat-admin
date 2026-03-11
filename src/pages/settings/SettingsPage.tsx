import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { settingsApi } from "@/api/settingsApi";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"general" | "admins">("general");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [deleteAdminTarget, setDeleteAdminTarget] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const [sRes, aRes] = await Promise.all([settingsApi.getAll(), settingsApi.getAdmins()]);
        setSettings(sRes.data.settings || {});
        setMaintenanceMode(sRes.data.settings?.maintenanceMode || false);
        setAdmins(aRes.data.admins || []);
      } catch { console.error("Failed to load settings"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleToggleMaintenance = async () => {
    try {
      await settingsApi.toggleMaintenance(!maintenanceMode);
      setMaintenanceMode(!maintenanceMode);
      toast.success(`Maintenance mode ${!maintenanceMode ? "enabled" : "disabled"}`);
    } catch { toast.error("Failed"); }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return toast.error("All fields required");
    try {
      await settingsApi.createAdmin(newAdmin);
      toast.success("Admin created");
      setNewAdmin({ name: "", email: "", password: "" });
      setShowAddAdmin(false);
      const aRes = await settingsApi.getAdmins();
      setAdmins(aRes.data.admins || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deleteAdminTarget) return;
    try {
      await settingsApi.deleteAdmin(deleteAdminTarget.id || deleteAdminTarget._id);
      toast.success("Admin removed");
      setDeleteAdminTarget(null);
      const aRes = await settingsApi.getAdmins();
      setAdmins(aRes.data.admins || []);
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab("general")}
          className={`px-4 py-2 text-sm rounded-lg ${activeTab === "general" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>General</button>
        <button onClick={() => setActiveTab("admins")}
          className={`px-4 py-2 text-sm rounded-lg ${activeTab === "admins" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Admin Accounts</button>
      </div>

      {activeTab === "general" ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">App Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Disable the app temporarily for maintenance</p>
                </div>
                <button onClick={handleToggleMaintenance}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${maintenanceMode ? "bg-red-500" : "bg-gray-300"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">App Name</p>
                  <p className="font-medium">{settings.appName || "NestChat"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">App Version</p>
                  <p className="font-medium">{settings.appVersion || "1.0.0"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Max Group Members</p>
                  <p className="font-medium">{settings.maxGroupMembers || 256}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Max File Size</p>
                  <p className="font-medium">{settings.maxFileSize || "25 MB"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Admin Accounts ({admins.length})</h3>
              <button onClick={() => setShowAddAdmin(!showAddAdmin)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {showAddAdmin ? "Cancel" : "Add Admin"}
              </button>
            </div>
            {showAddAdmin && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg space-y-3">
                <input value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="Name" className="w-full px-4 py-2 border rounded-lg" />
                <input value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
                <input value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg" />
                <button onClick={handleAddAdmin} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Create</button>
              </div>
            )}
            <div className="space-y-3">
              {admins.map((admin: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {(admin.name || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{admin.name}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{admin.role || "admin"}</span>
                    <button onClick={() => setDeleteAdminTarget(admin)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              ))}
              {admins.length === 0 && <p className="text-center text-gray-400 py-8">No admin accounts</p>}
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteAdminTarget} title="Remove Admin"
        message={`Remove admin "${deleteAdminTarget?.name}"?`}
        confirmLabel="Remove" variant="danger" onConfirm={handleDeleteAdmin} onCancel={() => setDeleteAdminTarget(null)} />
    </div>
  );
}
