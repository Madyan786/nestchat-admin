import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  admin: { id: string; name: string; email: string; role: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (admin: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      login: (admin, token) => {
        localStorage.setItem("admin_token", token);
        set({ admin, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem("admin_token");
        set({ admin: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "nestchat-admin-auth" }
  )
);
