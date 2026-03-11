import api from "./axiosInstance";

export const notificationsApi = {
  broadcast: (data: any) => api.post("/api/admin/notifications/broadcast", data),
  sendToUser: (data: any) => api.post("/api/admin/notifications/send", data),
  getHistory: (page = 1) => api.get(`/api/admin/notifications/history?page=${page}`),
};
