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

/**
 * Get a user-friendly error message from an API error
 * @param {Error} error - The error object from axios
 * @returns {string} A user-friendly error message
 */
const getErrorMessage = (error) => {
    // Check if we have a response with data and a message
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Handle different HTTP status codes with friendly messages
    if (error.response) {
        switch (error.response.status) {
            case 400:
                return "The request was invalid. Please check your input and try again.";
            case 401:
                return "You need to log in again to continue.";
            case 403:
                return "You don't have permission to access this resource.";
            case 404:
                return "The requested resource was not found.";
            case 500:
            case 502:
            case 503:
            case 504:
                return "The server encountered an error. Please try again later.";
            default:
                return `Request failed with status: ${error.response.status}`;
        }
    }

    // Network errors
    if (error.request && !error.response) {
        return "Network error. Please check your internet connection and try again.";
    }

    // Default fallback message
    return error.message || "An unexpected error occurred. Please try again.";
};

// Add response interceptor to handle token expiration and other errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Log all API errors for debugging
        console.error("API Error:", {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
            responseData: error.response?.data,
        });

        const originalRequest = error.config;
        const errorMessage = getErrorMessage(error);

        // Get the endpoint name for better error context
        const endpoint = error.config?.url?.split("/")?.pop() || "API";
        const capitalizedEndpoint =
            endpoint.charAt(0).toUpperCase() + endpoint.slice(1);

        // Handle authentication errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log("Authentication error detected, clearing credentials");

            // Clear token and user data
            try {
                await AsyncStorage.removeItem("userToken");
                await AsyncStorage.removeItem("user");
                console.log("User credentials cleared");

                // Show authentication error to user
                showDialog(
                    "Session Expired",
                    "Your session has expired. Please log in again."
                );

                // Force app to re-render and show login screen
                // This would typically be handled by your auth context
                // window.location.href = '/login'; // For web
            } catch (storageError) {
                console.error("Error clearing storage:", storageError);
            }
        }
        // For server errors, provide more context and show to user
        else if (error.response?.status >= 500) {
            console.error(
                "Server error:",
                error.response?.data || error.message
            );

            showDialog(
                "Server Error",
                `${capitalizedEndpoint} server error: ${errorMessage}`
            );
        }
        // For client errors (400-level), show appropriate message
        else if (
            error.response?.status >= 400 &&
            error.response?.status < 500
        ) {
            // Don't show 401 errors here as they're handled above
            if (error.response.status !== 401) {
                showDialog(
                    "Request Failed",
                    `${capitalizedEndpoint} error: ${errorMessage}`
                );
            }
        }
        // For network errors
        else if (error.request && !error.response) {
            showDialog(
                "Connection Error",
                "Unable to connect to the server. Please check your internet connection and try again."
            );
        }
        // For all other errors
        else if (!originalRequest._retry) {
            // Avoid showing multiple errors for retried requests
            showDialog(
                "Error",
                `${capitalizedEndpoint} error: ${errorMessage}`
            );
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

/**
 * Utility function to handle API calls with error handling
 * Use this when you need to handle errors in a specific way in a component
 *
 * @param {Promise} apiCall - The API call to execute
 * @param {Object} options - Options for error handling
 * @param {boolean} options.showErrorDialog - Whether to show an error dialog (default: true)
 * @param {string} options.errorTitle - Custom error dialog title
 * @param {string} options.errorMessage - Custom error dialog message
 * @param {Function} options.onError - Custom error handler function
 * @returns {Promise} The result of the API call or null if there was an error
 *
 * @example
 * // Basic usage
 * const campaigns = await handleApiCall(campaignAPI.getCampaigns());
 *
 * // With custom error handling
 * const result = await handleApiCall(leadAPI.createLead(leadData), {
 *   errorTitle: "Lead Creation Failed",
 *   errorMessage: "Could not create the lead. Please try again.",
 *   onError: (error) => {
 *     // Custom error handling logic
 *     console.log("Custom error handler:", error);
 *   }
 * });
 */
export const handleApiCall = async (apiCall, options = {}) => {
    const {
        showErrorDialog = true,
        errorTitle,
        errorMessage,
        onError,
    } = options;

    try {
        const response = await apiCall;
        return response;
    } catch (error) {
        // Call custom error handler if provided
        if (onError && typeof onError === "function") {
            onError(error);
        }

        // Show custom error dialog if requested
        if (showErrorDialog && errorTitle && errorMessage) {
            showDialog(errorTitle, errorMessage);
        }

        // The global interceptor will already show a dialog for most errors
        // unless we've specified custom error messages

        return null;
    }
};

export default apiClient;
