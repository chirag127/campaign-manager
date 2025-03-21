import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { DialogProvider } from "./src/utils/dialogUtils";
import DialogBox from "./src/components/DialogBox";

// Define the theme
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#1976D2",
        accent: "#FF5722",
        background: "#F5F5F5",
        surface: "#FFFFFF",
        text: "#212121",
        error: "#D32F2F",
    },
};

export default function App() {
    // State for the dialog box
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        title: "",
        message: "",
        buttons: [],
    });

    // Function to show a dialog
    const showDialog = (title, message, buttons = []) => {
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

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <DialogProvider>
                    <AuthProvider>
                        <NavigationContainer>
                            <AppNavigator />
                            <StatusBar style="auto" />

                            {/* Global dialog box for web platform */}
                            <DialogBox
                                visible={dialogVisible}
                                title={dialogConfig.title}
                                message={dialogConfig.message}
                                buttons={dialogConfig.buttons}
                                onDismiss={hideDialog}
                            />
                        </NavigationContainer>
                    </AuthProvider>
                </DialogProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
