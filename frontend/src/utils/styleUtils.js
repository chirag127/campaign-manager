import { StyleSheet } from "react-native";
import theme from "../theme/theme";

/**
 * Common styles that can be reused across the app
 */
export const commonStyles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        padding: theme.spacing.md,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.md,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    spaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    // Card styles
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    elevatedCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.md,
    },

    // Text styles
    title: {
        fontSize: theme.typography.fontSizes.xxl,
        fontWeight: theme.typography.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.medium,
        color: theme.colors.text,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    bodyText: {
        fontSize: theme.typography.fontSizes.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    captionText: {
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.textSecondary,
    },
    errorText: {
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },

    // Form styles
    formContainer: {
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
        padding: theme.spacing.md,
    },
    input: {
        marginBottom: theme.spacing.md,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: theme.spacing.md,
    },
    button: {
        marginHorizontal: theme.spacing.xs,
        flex: 1,
    },

    // Image styles
    roundedImage: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.round,
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: theme.borderRadius.sm,
    },

    // Utility styles
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.md,
    },
    shadow: {
        ...theme.shadows.md,
    },
    badge: {
        backgroundColor: theme.colors.primary,
        color: "white",
        borderRadius: theme.borderRadius.round,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        fontSize: theme.typography.fontSizes.xs,
        fontWeight: theme.typography.fontWeights.bold,
    },
    chip: {
        borderRadius: theme.borderRadius.round,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.primaryLight,
        marginRight: theme.spacing.xs,
        marginBottom: theme.spacing.xs,
    },
    chipText: {
        color: "white",
        fontSize: theme.typography.fontSizes.sm,
    },
});

/**
 * Helper function to create shadow styles based on elevation level
 * @param {number} elevation - Elevation level (1-5)
 * @returns {Object} Shadow styles
 */
export const getShadow = (elevation = 2) => {
    switch (elevation) {
        case 1:
            return theme.shadows.xs;
        case 2:
            return theme.shadows.sm;
        case 3:
            return theme.shadows.md;
        case 4:
            return theme.shadows.lg;
        case 5:
            return theme.shadows.xl;
        default:
            return theme.shadows.sm;
    }
};

/**
 * Helper function to get spacing value
 * @param {string} size - Size (xs, sm, md, lg, xl, xxl)
 * @returns {number} Spacing value
 */
export const getSpacing = (size = "md") => {
    return theme.spacing[size] || theme.spacing.md;
};

/**
 * Helper function to get font size
 * @param {string} size - Size (xs, sm, md, lg, xl, xxl, xxxl)
 * @returns {number} Font size
 */
export const getFontSize = (size = "md") => {
    return theme.typography.fontSizes[size] || theme.typography.fontSizes.md;
};

/**
 * Helper function to get font weight
 * @param {string} weight - Weight (light, regular, medium, semibold, bold)
 * @returns {string} Font weight
 */
export const getFontWeight = (weight = "regular") => {
    return (
        theme.typography.fontWeights[weight] ||
        theme.typography.fontWeights.regular
    );
};

/**
 * Helper function to get border radius
 * @param {string} size - Size (xs, sm, md, lg, xl, round)
 * @returns {number} Border radius
 */
export const getBorderRadius = (size = "md") => {
    return theme.borderRadius[size] || theme.borderRadius.md;
};

export default {
    commonStyles,
    getShadow,
    getSpacing,
    getFontSize,
    getFontWeight,
    getBorderRadius,
};
