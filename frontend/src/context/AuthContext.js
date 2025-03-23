import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Initialize auth state from storage
    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("userToken");
                const storedUser = await AsyncStorage.getItem("user");

                if (storedToken && storedUser) {
                    setUserToken(storedToken);
                    setUser(JSON.parse(storedUser));

                    // Set axios default header
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${storedToken}`;
                }
            } catch (error) {
                console.error("Error loading auth data from storage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStorageData();
    }, []);

    // Login function
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            // Import apiClient here to avoid circular dependency
            const { authAPI } = require("../api/apiClient");

            const response = await authAPI.login(email, password);

            const { token, user } = response.data;

            // Store token and user data
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));

            // Set state
            setUserToken(token);
            setUser(user);

            // Set axios default header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return true;
        } catch (error) {
            // Get a user-friendly error message
            const errorMessage =
                error.response?.data?.message ||
                "Login failed. Please try again.";

            // Set the error state
            setError(errorMessage);

            // Import showDialog to display the error
            const showDialog = require("../utils/showDialog").default;

            // Show a dialog with the error message
            showDialog("Login Failed", errorMessage);

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Register function
    const register = async (name, email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            // Import apiClient here to avoid circular dependency
            const { authAPI } = require("../api/apiClient");

            const response = await authAPI.register(name, email, password);

            const { token, user } = response.data;

            // Store token and user data
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));

            // Set state
            setUserToken(token);
            setUser(user);

            // Set axios default header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return true;
        } catch (error) {
            // Get a user-friendly error message
            const errorMessage =
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            // Set the error state
            setError(errorMessage);

            // Import showDialog to display the error
            const showDialog = require("../utils/showDialog").default;

            // Show a dialog with the error message
            showDialog("Registration Failed", errorMessage);

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        setIsLoading(true);

        try {
            // Clear storage
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("user");

            // Clear state
            setUserToken(null);
            setUser(null);

            // Clear axios default header
            delete axios.defaults.headers.common["Authorization"];

            return true;
        } catch (error) {
            console.error("Error during logout:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.put(
                `${API_URL}/api/auth/me`,
                userData
            );

            const updatedUser = response.data.data;

            // Update stored user data
            await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

            // Update state
            setUser(updatedUser);

            return true;
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Profile update failed. Please try again."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete user account
    const deleteAccount = async (password) => {
        setIsLoading(true);
        setError(null);

        try {
            // Import apiClient here to avoid circular dependency
            const { authAPI } = require("../api/apiClient");

            // Make API call to delete account
            await authAPI.deleteAccount(password);

            // Clear storage
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("user");

            // Clear state
            setUserToken(null);
            setUser(null);

            // Clear axios default header
            delete axios.defaults.headers.common["Authorization"];

            return true;
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Account deletion failed. Please try again."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userToken,
                user,
                error,
                login,
                register,
                logout,
                updateProfile,
                deleteAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
