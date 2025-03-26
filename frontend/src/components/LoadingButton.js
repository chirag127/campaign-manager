import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

/**
 * A button component with built-in loading state
 * Extends react-native-paper Button with consistent loading behavior
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.isLoading=false] - Whether the button is in loading state
 * @param {string} [props.loadingText] - Text to display when loading (if not provided, uses children)
 * @param {Object} [props.style] - Additional styles for the button
 * @param {Object} [props.labelStyle] - Additional styles for the button label
 * @param {boolean} [props.disableWhenLoading=true] - Whether to disable the button when loading
 */
const LoadingButton = ({
    isLoading = false,
    loadingText,
    style,
    labelStyle,
    disableWhenLoading = true,
    children,
    ...props
}) => {
    // Determine button text based on loading state
    const buttonText = isLoading && loadingText ? loadingText : children;

    return (
        <Button
            {...props}
            loading={isLoading}
            disabled={disableWhenLoading && isLoading ? true : props.disabled}
            style={[styles.button, style]}
            labelStyle={[styles.buttonLabel, labelStyle]}
        >
            {buttonText}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 4,
        paddingVertical: 6,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "500",
        paddingVertical: 4,
    },
});

export default LoadingButton;
