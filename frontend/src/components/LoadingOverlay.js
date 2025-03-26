import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

/**
 * A semi-transparent overlay with a loading indicator
 * Less intrusive than a full-screen loading component
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.visible=false] - Whether the overlay is visible
 * @param {string} [props.message="Loading..."] - Message to display below the spinner
 * @param {string} [props.backgroundColor="rgba(255, 255, 255, 0.8)"] - Background color of the overlay
 * @param {string} [props.size="large"] - Size of the activity indicator
 */
const LoadingOverlay = ({
    visible = false,
    message = "Loading...",
    backgroundColor = "rgba(255, 255, 255, 0.8)",
    size = "large",
}) => {
    const theme = useTheme();

    if (!visible) return null;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={size} color={theme.colors.primary} />
                {message && <Text style={styles.loadingText}>{message}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    loadingContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: "#666",
    },
});

export default LoadingOverlay;
