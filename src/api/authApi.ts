import api from "./axiosInstance";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/api/admin/auth/login", data),
  logout: () => api.post("/api/admin/auth/logout"),
  getMe: () => api.get("/api/admin/auth/me"),
};
