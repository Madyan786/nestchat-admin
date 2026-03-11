import api from "./axiosInstance";

export const analyticsApi = {
  getDashboardStats: () => api.get("/api/admin/analytics/stats"),
  getUsersGrowth: (days = 30) => api.get(`/api/admin/analytics/users-growth?days=${days}`),
  getMessagesVolume: (days = 7) => api.get(`/api/admin/analytics/messages-volume?days=${days}`),
  getMessageTypes: () => api.get("/api/admin/analytics/message-types"),
  getPeakHours: () => api.get("/api/admin/analytics/peak-hours"),
  getTopUsers: (limit = 10) => api.get(`/api/admin/analytics/top-users?limit=${limit}`),
};
