import { AuthProvider } from "@refinedev/core";
import axios from "axios";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      return { success: true, redirectTo: "/" };
    } catch {
      return { success: false, error: new Error("Login failed") };
    }
  },
  logout: async () => {
    localStorage.removeItem("token");
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const token = localStorage.getItem("token");
    return token ? { authenticated: true } : { authenticated: false, redirectTo: "/login" };
  },
  getIdentity: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null as any;
    try {
      const response = await axios.get("http://localhost:3000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error) {
      console.error("Failed to get user identity:", error);
      return null;
    }
  },
  onError: async (error) => {
    return { error };
  },
};
