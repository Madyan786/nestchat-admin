import api from "./axiosInstance";
import type { ContactListResponse } from "@/types/contact";

export const contactsApi = {
  getAll: (filters: any = {}) => {
    const p = new URLSearchParams();
    if (filters.search) p.append("search", filters.search);
    if (filters.online !== undefined) p.append("online", String(filters.online));
    if (filters.isVisible !== undefined) p.append("isVisible", String(filters.isVisible));
    p.append("page", String(filters.page || 1));
    p.append("limit", String(filters.limit || 20));
    return api.get<ContactListResponse>(`/api/admin/contacts?${p}`);
  },
  getSavedContacts: (userId: string) =>
    api.get(`/api/admin/contacts/${userId}/saved`),
  exportList: (format: "xlsx" | "csv" = "xlsx") =>
    api.get(`/api/admin/contacts/export?format=${format}`, { responseType: "blob" }),
};
