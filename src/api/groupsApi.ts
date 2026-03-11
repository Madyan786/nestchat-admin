import api from "./axiosInstance";

export const groupsApi = {
  getAll: (filters: any = {}) => {
    const p = new URLSearchParams();
    if (filters.search) p.append("search", filters.search);
    p.append("page", String(filters.page || 1));
    p.append("limit", String(filters.limit || 20));
    return api.get(`/api/admin/groups?${p}`);
  },
  getById: (id: string) => api.get(`/api/admin/groups/${id}`),
  getMessages: (id: string, page = 1) => api.get(`/api/admin/groups/${id}/messages?page=${page}`),
  update: (id: string, data: any) => api.put(`/api/admin/groups/${id}`, data),
  delete: (id: string) => api.delete(`/api/admin/groups/${id}`),
  addMember: (gId: string, userId: string) => api.post(`/api/admin/groups/${gId}/members`, { userId }),
  removeMember: (gId: string, uId: string) => api.delete(`/api/admin/groups/${gId}/members/${uId}`),
};
