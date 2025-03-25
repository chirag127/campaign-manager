import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

/**
 * A full-screen loading component to display during transitions
 * @param {Object} props - Component props
 * @param {string} [props.message="Loading..."] - Message to display below the spinner
 */
const LoadingScreen = ({ message = "Loading..." }) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
});

export default LoadingScreen;
