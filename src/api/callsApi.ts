import api from "./axiosInstance";

export const callsApi = {
  getAll: (filters: any = {}) => {
    const p = new URLSearchParams();
    if (filters.search) p.append("search", filters.search);
    if (filters.callType) p.append("callType", filters.callType);
    if (filters.status) p.append("status", filters.status);
    p.append("page", String(filters.page || 1));
    p.append("limit", String(filters.limit || 20));
    return api.get(`/api/admin/calls?${p}`);
  },
  getById: (id: string) => api.get(`/api/admin/calls/${id}`),
};
