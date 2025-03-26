import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

/**
 * A FlatList component with built-in loading states
 * Handles empty state, loading state, and refreshing state
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.loading=false] - Whether the list is in loading state
 * @param {boolean} [props.refreshing=false] - Whether the list is refreshing
 * @param {string} [props.loadingMessage="Loading..."] - Message to display when loading
 * @param {string} [props.emptyMessage="No items found"] - Message to display when the list is empty
 * @param {Object} [props.style] - Additional styles for the container
 * @param {Object} [props.contentContainerStyle] - Additional styles for the content container
 */
const LoadingFlatList = ({
    data = [],
    loading = false,
    refreshing = false,
    loadingMessage = "Loading...",
    emptyMessage = "No items found",
    style,
    contentContainerStyle,
    ...props
}) => {
    const theme = useTheme();

    // Full loading state (initial load)
    if (loading && !refreshing && (!data || data.length === 0)) {
        return (
            <View style={[styles.loadingContainer, style]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>{loadingMessage}</Text>
            </View>
        );
    }

    // Empty state
    const renderEmptyComponent = () => {
        if (loading || refreshing) return null;

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
        );
    };

    // Footer loading indicator for pagination
    const renderFooter = () => {
        if (!props.onEndReached || !loading || refreshing) return null;

        return (
            <View style={styles.footerContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.footerText}>Loading more...</Text>
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            refreshing={refreshing}
            style={style}
            contentContainerStyle={[
                styles.contentContainer,
                !data || data.length === 0 ? styles.emptyListContent : null,
                contentContainerStyle,
            ]}
            ListEmptyComponent={renderEmptyComponent}
            ListFooterComponent={renderFooter}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    contentContainer: {
        flexGrow: 1,
    },
    emptyListContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    footerText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#666",
    },
});

export default LoadingFlatList;
