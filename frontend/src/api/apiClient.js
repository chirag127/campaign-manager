import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear token and redirect to login
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("user");

            // Force app to re-render and show login screen
            // This would typically be handled by your auth context

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) =>
        apiClient.post("/api/auth/login", { email, password }),
    register: (name, email, password) =>
        apiClient.post("/api/auth/register", { name, email, password }),
    getProfile: () => apiClient.get("/api/auth/me"),
    updateProfile: (userData) => apiClient.put("/api/auth/me", userData),
};

// Campaign API
export const campaignAPI = {
    getCampaigns: () => apiClient.get("/api/campaigns"),
    getCampaign: (id) => apiClient.get(`/api/campaigns/${id}`),
    createCampaign: (campaignData) =>
        apiClient.post("/api/campaigns", campaignData),
    updateCampaign: (id, campaignData) =>
        apiClient.put(`/api/campaigns/${id}`, campaignData),
    deleteCampaign: (id) => apiClient.delete(`/api/campaigns/${id}`),
    syncCampaignMetrics: (id) => apiClient.get(`/api/campaigns/${id}/sync`),
    syncCampaignLeads: (id) => apiClient.get(`/api/campaigns/${id}/sync-leads`),
};

// Lead API
export const leadAPI = {
    getLeads: () => apiClient.get("/api/leads"),
    getLead: (id) => apiClient.get(`/api/leads/${id}`),
    createLead: (leadData) => apiClient.post("/api/leads", leadData),
    updateLead: (id, leadData) => apiClient.put(`/api/leads/${id}`, leadData),
    deleteLead: (id) => apiClient.delete(`/api/leads/${id}`),
};

// Platform API
export const platformAPI = {
    getPlatforms: () => apiClient.get("/api/platforms"),
    getPlatform: (id) => apiClient.get(`/api/platforms/${id}`),
    connectPlatform: (platform, code, redirectUri) =>
        apiClient.post(`/api/platforms/${platform}/connect`, {
            code,
            redirectUri,
        }),
    disconnectPlatform: (platform) =>
        apiClient.post(`/api/platforms/${platform}/disconnect`),
    getConnectedPlatforms: () => apiClient.get("/api/platforms/connected"),
};

export default apiClient;
