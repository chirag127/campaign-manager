import { DefaultTheme } from "react-native-paper";

// Modern color palette
const colors = {
    // Primary colors
    primary: "#3F51B5", // Indigo
    primaryLight: "#7986CB",
    primaryDark: "#303F9F",

    // Secondary colors
    secondary: "#FF4081", // Pink
    secondaryLight: "#FF80AB",
    secondaryDark: "#F50057",

    // Accent colors
    accent: "#00BCD4", // Cyan
    accentLight: "#4DD0E1",
    accentDark: "#0097A7",

    // Neutral colors
    background: "#F9FAFB",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    // Text colors
    text: "#212121",
    textSecondary: "#757575",
    textLight: "#9E9E9E",

    // Status colors
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#F44336",
    info: "#2196F3",

    // UI colors
    border: "#E0E0E0",
    disabled: "#BDBDBD",
    placeholder: "#9E9E9E",
    backdrop: "rgba(0, 0, 0, 0.5)",
};

// Spacing system (in pixels)
const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// Typography
const typography = {
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 30,
    },
    fontWeights: {
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    },
};

// Border radius
const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
};

// Shadows
const shadows = {
    none: {
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
    },
    xl: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 12,
    },
};

// Animation durations
const animation = {
    fast: 200,
    normal: 300,
    slow: 500,
};

// Create the theme object
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        ...colors,
    },
    spacing,
    typography,
    borderRadius,
    shadows,
    animation,
    dark: false,
    roundness: borderRadius.sm,
};

export default theme;
