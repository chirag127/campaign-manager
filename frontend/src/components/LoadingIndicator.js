import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useLoading } from "../context/LoadingContext";

/**
 * A component to display loading indicators for specific sections
 * Can be used inline within content
 *
 * @param {Object} props - Component props
 * @param {string} [props.sectionId] - ID of the section to check loading state
 * @param {boolean} [props.isLoading] - Manual loading state (overrides sectionId)
 * @param {string} [props.message] - Loading message
 * @param {string} [props.size="small"] - Size of the activity indicator
 * @param {Object} [props.style] - Additional styles for the container
 */
const LoadingIndicator = ({
    sectionId,
    isLoading: manualLoading,
    message,
    size = "small",
    style,
}) => {
    const theme = useTheme();
    const { isSectionLoading, getSectionLoadingMessage } = useLoading();

    // Determine if loading based on props or context
    const isLoading = manualLoading !== undefined
        ? manualLoading
        : (sectionId ? isSectionLoading(sectionId) : false);

    // Get message from props or context
    const loadingMessage = message || (sectionId ? getSectionLoadingMessage(sectionId) : "Loading...");

    if (!isLoading) return null;

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={theme.colors.primary} />
            {loadingMessage && <Text style={styles.text}>{loadingMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
    },
    text: {
        marginLeft: 8,
        fontSize: 14,
        color: "#666",
    },
});

export default LoadingIndicator;
