import { Alert, Platform } from "react-native";
import { createContext, useState, useContext } from "react";
import DialogBox from "../components/DialogBox";

// Create a context to manage dialog state
export const DialogContext = createContext();

/**
 * Dialog Provider component to wrap the app
 * This provides the dialog state and functions to show dialogs
 */
export const DialogProvider = ({ children }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        title: "",
        message: "",
        buttons: [],
    });

    // Function to show a dialog
    const showDialog = (title, message, buttons = []) => {
        // For non-web platforms, use the native Alert
        if (Platform.OS !== "web") {
            Alert.alert(title, message, buttons);
            return;
        }

        // For web platform, use our custom dialog
        setDialogConfig({
            title,
            message,
            buttons,
        });
        setDialogVisible(true);
    };

    // Function to hide the dialog
    const hideDialog = () => {
        setDialogVisible(false);
    };

    // Expose the dialog context globally for web platform
    // This allows standalone functions to access the dialog context
    if (Platform.OS === "web" && typeof window !== "undefined") {
        window.__DIALOG_CONTEXT__ = {
            showDialog,
            hideDialog,
            dialogVisible,
            dialogConfig,
        };
    }

    return (
        <DialogContext.Provider
            value={{
                dialogVisible,
                dialogConfig,
                showDialog,
                hideDialog,
            }}
        >
            {children}

            {/* Render the DialogBox component */}
            <DialogBox
                visible={dialogVisible}
                title={dialogConfig.title}
                message={dialogConfig.message}
                buttons={dialogConfig.buttons}
                onDismiss={hideDialog}
            />
        </DialogContext.Provider>
    );
};

/**
 * Hook to use the dialog functionality
 * @returns {Object} Dialog functions and state
 */
export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
};

/**
 * Standalone function to show a dialog
 * This is a direct replacement for Alert.alert
 *
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Array} buttons - Array of button objects with text, style, and onPress properties
 */
export const showDialog = (title, message, buttons = []) => {
    // For non-web platforms, use the native Alert
    // if (Platform.OS !== "web") {
    //     Alert.alert(title, message, buttons);
    //     return;
    // }

    // For web platform, try to use the global dialog context
    if (typeof window !== "undefined" && window.__DIALOG_CONTEXT__) {
        window.__DIALOG_CONTEXT__.showDialog(title, message, buttons);
        return;
    }

    // Fallback to browser alert if dialog context is not available
    console.warn(
        "showDialog was called outside of DialogProvider. Make sure to wrap your app with DialogProvider or use the useDialog hook."
    );

    if (typeof window !== "undefined" && window.alert) {
        window.alert(`${title}\n\n${message}`);
    }
};
