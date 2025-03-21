import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

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
    // Configure linking for navigation
    const linking = {
        prefixes: [Linking.createURL("/")],
        config: {
            screens: {
                Main: {
                    screens: {
                        Dashboard: "dashboard",
                        Campaigns: {
                            screens: {
                                CampaignList: "campaigns",
                                CampaignDetail: "campaigns/:id",
                                CampaignCreate: "campaigns/create",
                            },
                        },
                        Leads: {
                            screens: {
                                LeadList: "leads",
                                LeadDetail: "leads/:id",
                            },
                        },
                        Platforms: "platforms",
                        Profile: "profile",
                    },
                },
                Auth: {
                    screens: {
                        Login: "login",
                        Register: "register",
                    },
                },
            },
        },
    };

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <AuthProvider>
                    <NavigationContainer linking={linking}>
                        <AppNavigator />
                        <StatusBar style="auto" />
                    </NavigationContainer>
                </AuthProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
