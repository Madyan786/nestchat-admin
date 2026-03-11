import api from "./axiosInstance";
import type { MediaFilters, MediaListResponse, MediaStats } from "@/types/media";

export const mediaApi = {
  getAll: (filters: MediaFilters = {}) => {
    const p = new URLSearchParams();
    if (filters.type) p.append("type", filters.type);
    if (filters.userId) p.append("userId", filters.userId);
    if (filters.search) p.append("search", filters.search);
    if (filters.dateFrom) p.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) p.append("dateTo", filters.dateTo);
    if (filters.flagged !== undefined) p.append("flagged", String(filters.flagged));
    if (filters.sortBy) p.append("sortBy", filters.sortBy);
    if (filters.sortOrder) p.append("sortOrder", filters.sortOrder);
    p.append("page", String(filters.page || 1));
    p.append("limit", String(filters.limit || 20));
    return api.get<MediaListResponse>(`/api/admin/media?${p}`);
  },
  getById: (id: string) => api.get(`/api/admin/media/${id}`),
  delete: (id: string) => api.delete(`/api/admin/media/${id}`),
  getStats: () => api.get<{ success: boolean; stats: MediaStats }>("/api/admin/media/stats"),
  getUserMedia: (userId: string, page = 1, limit = 20) =>
    api.get(`/api/admin/media/user/${userId}?page=${page}&limit=${limit}`),
  download: (id: string) =>
    api.get(`/api/admin/media/download/${id}`, { responseType: "blob" }),
  exportList: (type?: string, format: "xlsx" | "csv" = "xlsx") => {
    const p = new URLSearchParams({ format });
    if (type) p.append("type", type);
    return api.get(`/api/admin/media/export?${p}`, { responseType: "blob" });
  },
  toggleFlag: (id: string, flagged: boolean, reason?: string) =>
    api.put(`/api/admin/media/${id}/flag`, { flagged, reason }),
};
