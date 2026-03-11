import api from "./axiosInstance";
import type { UserFilters } from "@/types/user";

export const usersApi = {
  getAll: (filters: UserFilters = {}) => {
    const p = new URLSearchParams();
    if (filters.search) p.append("search", filters.search);
    p.append("page", String(filters.page || 1));
    p.append("limit", String(filters.limit || 50));
    return api.get(`/api/admin/users?${p}`);
  },
  getById: (id: string) => api.get(`/api/admin/users/${id}`),
  getUserFiles: (id: string, type: string) =>
    api.get(`/api/admin/users/${id}/files/${type}`),
  getUserAllFiles: (id: string) =>
    api.get(`/api/admin/users/${id}/files`),
  getStorageOverview: () => api.get(`/api/admin/storage/overview`),
  browsePath: (path: string) =>
    api.get(`/api/admin/storage/browse?path=${encodeURIComponent(path)}`),
  getWhatsAppData: (type: string, direction = "all") =>
    api.get(`/api/admin/storage/whatsapp?type=${type}&direction=${direction}`),
};
