import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { campaignAPI, leadAPI, handleApiCall } from "../api/apiClient";
import showDialog from "../utils/showDialog";

/**
 * Example component demonstrating different ways to handle API errors
 */
const ApiErrorHandlingExample = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    // Example 1: Using the global error handling (simplest approach)
    const fetchDataWithGlobalErrorHandling = async () => {
        setLoading(true);
        try {
            // This will use the global error interceptor to show errors
            const response = await campaignAPI.getCampaigns();
            setData(response.data);
        } catch (error) {
            // The global interceptor will already show a dialog
            // We can add additional handling here if needed
            console.log("Additional error handling in component:", error);
        } finally {
            setLoading(false);
        }
    };

    // Example 2: Using the handleApiCall utility (recommended approach)
    const fetchDataWithUtility = async () => {
        setLoading(true);

        // Basic usage - will use global error handling
        const response = await handleApiCall(campaignAPI.getCampaigns());

        if (response) {
            setData(response.data);
        }

        setLoading(false);
    };

    // Example 3: Using the handleApiCall utility with custom error handling
    const createItemWithCustomErrorHandling = async () => {
        setLoading(true);

        const dummyData = { name: "Test Lead", email: "test@example.com" };

        const response = await handleApiCall(leadAPI.createLead(dummyData), {
            // Custom error dialog
            errorTitle: "Lead Creation Failed",
            errorMessage:
                "Could not create the lead. Please check your input and try again.",

            // Custom error handler
            onError: (error) => {
                // Log specific error details
                console.log("Custom lead creation error handler:", error);

                // You could update UI state based on specific errors
                if (error.response?.status === 400) {
                    // Handle validation errors specifically
                }
            },
        });

        if (response) {
            setData(response.data);
            showDialog("Success", "Lead created successfully!");
        }

        setLoading(false);
    };

    // Example 4: Silencing the global error dialog and handling errors manually
    const silentErrorHandling = async () => {
        setLoading(true);

        const response = await handleApiCall(
            campaignAPI.getCampaign("invalid-id"),
            {
                // Don't show the default error dialog
                showErrorDialog: false,

                // Custom error handler
                onError: (error) => {
                    // Handle the error completely manually
                    if (error.response?.status === 404) {
                        showDialog(
                            "Not Found",
                            "The campaign you requested could not be found."
                        );
                    } else {
                        showDialog(
                            "Error",
                            "An unexpected error occurred while fetching the campaign."
                        );
                    }
                },
            }
        );

        if (response) {
            setData(response.data);
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>API Error Handling Examples</Text>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={fetchDataWithGlobalErrorHandling}
                    style={styles.button}
                    disabled={loading}
                >
                    Global Error Handling
                </Button>

                <Button
                    mode="contained"
                    onPress={fetchDataWithUtility}
                    style={styles.button}
                    disabled={loading}
                >
                    Using handleApiCall
                </Button>

                <Button
                    mode="contained"
                    onPress={createItemWithCustomErrorHandling}
                    style={styles.button}
                    disabled={loading}
                >
                    Custom Error Dialog
                </Button>

                <Button
                    mode="contained"
                    onPress={silentErrorHandling}
                    style={styles.button}
                    disabled={loading}
                >
                    Silent Error Handling
                </Button>
            </View>

            {loading && (
                <ActivityIndicator size="large" style={styles.loader} />
            )}

            {data && (
                <View style={styles.dataContainer}>
                    <Text style={styles.dataTitle}>Response Data:</Text>
                    <Text>{JSON.stringify(data, null, 2)}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    buttonContainer: {
        marginBottom: 24,
    },
    button: {
        marginBottom: 8,
    },
    loader: {
        marginVertical: 16,
    },
    dataContainer: {
        padding: 16,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    dataTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
});

export default ApiErrorHandlingExample;
