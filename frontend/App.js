import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { DialogProvider, useDialog } from "./src/utils/dialogUtils";
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

// Wrap the app with DialogProvider
export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <DialogProvider>
                    <AuthProvider>
                        <NavigationContainer>
                            <AppNavigator />
                            <StatusBar style="auto" />

                            {/* The DialogBox component is now managed by the DialogProvider */}
                        </NavigationContainer>
                    </AuthProvider>
                </DialogProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
