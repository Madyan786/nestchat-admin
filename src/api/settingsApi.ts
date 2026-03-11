import api from "./axiosInstance";

export const settingsApi = {
  getAll: () => api.get("/api/admin/settings"),
  update: (settings: any) => api.put("/api/admin/settings", settings),
  toggleMaintenance: (enabled: boolean) => api.post("/api/admin/settings/maintenance", { enabled }),
  getAdmins: () => api.get("/api/admin/settings/admins"),
  createAdmin: (data: any) => api.post("/api/admin/settings/admins", data),
  deleteAdmin: (id: string) => api.delete(`/api/admin/settings/admins/${id}`),
};
