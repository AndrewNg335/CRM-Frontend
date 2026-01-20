import { AuthProvider } from "@refinedev/core";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let profileCache: any = null;
let profileCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

let loginCallbacks: (() => void)[] = [];

export const addLoginCallback = (callback: () => void) => {
  loginCallbacks.push(callback);
};

export const removeLoginCallback = (callback: () => void) => {
  loginCallbacks = loginCallbacks.filter(cb => cb !== callback);
};

const executeLoginCallbacks = () => {
  loginCallbacks.forEach(callback => {
    try {
      callback();
    } catch (error) {
      
    }
  });
};

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem("token", response.data.token);
            profileCache = null;
            profileCacheTime = 0;
            
            executeLoginCallbacks();
            
            return { success: true, redirectTo: "/" };
        }
        catch (error: any) {
            let errorMessage = "";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            return { 
                success: false, 
                error: new Error(errorMessage) 
            };
        }
    },
    logout: async () => {
        localStorage.removeItem("token");
        profileCache = null;
        profileCacheTime = 0;
        
        loginCallbacks = [];
        
        return { success: true, redirectTo: "/login" };
    },
    check: async () => {
        const token = localStorage.getItem("token");
        return token ? { authenticated: true } : { authenticated: false, redirectTo: "/login" };
    },
    getIdentity: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            profileCache = null;
            profileCacheTime = 0;
            return null as any;
        }

        const now = Date.now();
        if (profileCache && (now - profileCacheTime) < CACHE_DURATION) {
            return profileCache;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            profileCache = response.data.user;
            profileCacheTime = now;
            
            return response.data.user;
        }
        catch (error) {
            
            profileCache = null;
            profileCacheTime = 0;
            return null;
        }
    },
    onError: async (error) => {
        return { error };
    },
};

export const clearProfileCache = () => {
    profileCache = null;
    profileCacheTime = 0;
};