import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from 'expo-linking';
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

// Define linking configuration
const linking = {
    prefixes: [
        Linking.createURL('/'),
        'https://campaign-manager1271.netlify.app',
        'https://campaign-manager1271.netlify.app/'
    ],
    config: {
        screens: {
            Main: {
                screens: {
                    Dashboard: 'dashboard',
                    Campaigns: {
                        screens: {
                            CampaignList: 'campaigns',
                            CampaignDetail: 'campaigns/:id',
                            CampaignCreate: 'campaigns/create',
                        }
                    },
                    Leads: {
                        screens: {
                            LeadList: 'leads',
                            LeadDetail: 'leads/:id',
                        }
                    },
                    Platforms: {
                        path: 'platforms',
                        // This will handle OAuth callbacks with code and state parameters
                        parse: {
                            code: (code) => code,
                            state: (state) => state,
                        },
                    },
                    Profile: 'profile',
                }
            },
            Auth: {
                screens: {
                    Login: 'login',
                    Register: 'register',
                    ForgotPassword: 'forgot-password',
                }
            },
            PrivacyPolicy: 'privacy-policy',
            TermsOfService: 'terms-of-service',
        },
    },
};

// Wrap the app with DialogProvider
export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <DialogProvider>
                    <AuthProvider>
                        <NavigationContainer linking={linking}>
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
