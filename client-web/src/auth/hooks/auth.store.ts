import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Auth } from "@auth/types";

interface AuthState {
  auth: Auth | null;
  isAuthenticated: boolean;
  setAuth: (auth: Auth) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,
      isAuthenticated: false,

      // Guarda token y user
      setAuth: (auth) => set({ auth, isAuthenticated: true }),

      // Limpia todo
      clearAuth: () => set({ auth: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // clave en localStorage
    }
  )
);
