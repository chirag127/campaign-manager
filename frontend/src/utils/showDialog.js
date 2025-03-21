import { Alert, Platform } from "react-native";
import { useDialog } from "./dialogUtils";

/**
 * Utility function to show a dialog box
 * This is a direct replacement for Alert.alert
 *
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Array} buttons - Array of button objects with text, style, and onPress properties
 */
const showDialog = (title, message, buttons = []) => {
    // For non-web platforms, use the native Alert
    if (Platform.OS !== "web") {
        Alert.alert(title, message, buttons);
        return;
    }

    // For web platform, use our custom dialog
    // Get the global dialog context from the DialogProvider
    try {
        // Try to access the global dialog context
        const dialogContext = window.__DIALOG_CONTEXT__;
        if (dialogContext && dialogContext.showDialog) {
            dialogContext.showDialog(title, message, buttons);
            return;
        }
    } catch (error) {
        console.warn("Error accessing dialog context:", error);
    }

    // Fallback to browser alert if dialog context is not available
    if (typeof window !== "undefined" && window.alert) {
        window.alert(`${title}\n\n${message}`);
    }
};

/**
 * Hook to use the dialog functionality
 * @returns {Function} showDialog function
 */
export const useShowDialog = () => {
    const { showDialog: contextShowDialog } = useDialog();

    return (title, message, buttons = []) => {
        if (Platform.OS !== "web") {
            Alert.alert(title, message, buttons);
            return;
        }

        contextShowDialog(title, message, buttons);
    };
};

export default showDialog;
