import React from "react";
import { Pressable, StyleSheet, Text, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { getShadowStyles } from "../utils/animationUtils";

/**
 * A custom button component that uses Pressable instead of TouchableMixin
 * This helps avoid deprecation warnings on web platform
 */
const PressableButton = ({
    onPress,
    title,
    style,
    textStyle,
    disabled = false,
    mode = "contained", // 'contained', 'outlined', 'text'
    color,
    children,
}) => {
    const theme = useTheme();
    const buttonColor = color || theme.colors.primary;

    // Determine styles based on mode
    const getButtonStyle = () => {
        switch (mode) {
            case "contained":
                return {
                    backgroundColor: disabled
                        ? theme.colors.disabled
                        : buttonColor,
                    borderWidth: 0,
                };
            case "outlined":
                return {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: disabled ? theme.colors.disabled : buttonColor,
                };
            case "text":
            default:
                return {
                    backgroundColor: "transparent",
                    borderWidth: 0,
                };
        }
    };

    const getTextColor = () => {
        switch (mode) {
            case "contained":
                return "#ffffff";
            case "outlined":
            case "text":
            default:
                return disabled ? theme.colors.disabled : buttonColor;
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                getButtonStyle(),
                pressed && styles.pressed,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
        >
            {children || (
                <Text
                    style={[styles.text, { color: getTextColor() }, textStyle]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 64,
        ...getShadowStyles({
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        }),
    },
    text: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
    },
    pressed: {
        opacity: Platform.OS === "ios" ? 0.8 : 1,
    },
});

export default PressableButton;
