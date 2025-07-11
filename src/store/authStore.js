// /src/store/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  userRole: localStorage.getItem("userRole") || null, // <-- add userRole

  setTokens: ({ accessToken, refreshToken, userRole }) => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (userRole) localStorage.setItem("userRole", userRole);

    set({ accessToken, refreshToken, userRole });
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole"); // <-- clear userRole
    set({ accessToken: null, refreshToken: null, userRole: null });
  },
}));

export default useAuthStore;
