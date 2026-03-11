import api from "./axiosInstance";

export const blocksApi = {
  getAll: (page = 1, limit = 20, search?: string) => {
    const p = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) p.append("search", search);
    return api.get(`/api/admin/blocks?${p}`);
  },
  forceUnblock: (blockerProfileId: string, blockedProfileId: string) =>
    api.post("/api/admin/blocks/force-unblock", { blockerProfileId, blockedProfileId }),
};
