// GlobalStore/useUserStore.js
import { create } from "zustand";
import useCartStore from "./useCartStore";
import useFavouritesStore from "./useFavouritesStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  //  Register a new user
  register: async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // store token and user if returned
      if (data.token) {
        localStorage.setItem("token", data.token);
        set({ token: data.token, user: data.user });
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error(" Registration error:", error);
      return { success: false, message: error.message };
    }
  },

  //  Log in an existing user
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token and user
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token });

      return { success: true, user: data.user };
    } catch (error) {
      console.error(" Login error:", error);
      return { success: false, message: error.message };
    }
  },

  //  Log out
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
    useCartStore.getState().syncClearCart();
    useFavouritesStore.getState().clearFavourites();
  },

  // Load user from token (for persistent sessions)
  loadUserFromToken: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.user) {
        set({ user: data.user, token });
      } else {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      }
    } catch (error) {
      console.error(" Failed to load user:", error);
      localStorage.removeItem("token");
      set({ user: null, token: null });
    }
  },
}));
