import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { shouldUseNativeDriver } from "../utils/animationUtils";
import LoadingScreen from "../components/LoadingScreen";
import AppHeader from "../components/AppHeader";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

// Main Screens
import DashboardScreen from "../screens/DashboardScreen";
import CampaignListScreen from "../screens/campaigns/CampaignListScreen";
import CampaignDetailScreen from "../screens/campaigns/CampaignDetailScreen";
import CampaignCreateScreen from "../screens/campaigns/CampaignCreateScreen";
import LeadListScreen from "../screens/leads/LeadListScreen";
import LeadDetailScreen from "../screens/leads/LeadDetailScreen";
import PlatformScreen from "../screens/platforms/PlatformScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Legal Screens
import PrivacyPolicyScreen from "../screens/legal/PrivacyPolicyScreen";
import TermsOfServiceScreen from "../screens/legal/TermsOfServiceScreen";
import DeleteAccountScreen from "../screens/legal/DeleteAccountScreen";

// Context
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
);

// Campaign Stack Navigator
const CampaignStackNavigator = () => (
    <Stack.Navigator
        screenOptions={{
            animation: "slide_from_right",
            useNativeDriver: shouldUseNativeDriver(),
        }}
    >
        <Stack.Screen
            name="CampaignList"
            component={CampaignListScreen}
            options={{ title: "Campaigns" }}
        />
        <Stack.Screen
            name="CampaignDetail"
            component={CampaignDetailScreen}
            options={{ title: "Campaign Details" }}
        />
        <Stack.Screen
            name="CampaignCreate"
            component={CampaignCreateScreen}
            options={{ title: "Create Campaign" }}
        />
    </Stack.Navigator>
);

// Lead Stack Navigator
const LeadStackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="LeadList"
            component={LeadListScreen}
            options={{ title: "Leads" }}
        />
        <Stack.Screen
            name="LeadDetail"
            component={LeadDetailScreen}
            options={{ title: "Lead Details" }}
        />
    </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ title: "Profile" }}
        />
    </Stack.Navigator>
);

// Main Tab Navigator
const MainNavigator = () => {
    const theme = useTheme();

    return (
        <>
            <AppHeader />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    // Use appropriate animation driver based on platform
                    animationEnabled: true,
                    // Only use native driver on native platforms, not on web
                    animationTypeForReplace: "push",
                    animation: "fade",
                    useNativeDriver: shouldUseNativeDriver(),
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === "Dashboard") {
                            iconName = focused ? "home" : "home-outline";
                        } else if (route.name === "Campaigns") {
                            iconName = focused ? "megaphone" : "megaphone-outline";
                        } else if (route.name === "Leads") {
                            iconName = focused ? "people" : "people-outline";
                        } else if (route.name === "Platforms") {
                            iconName = focused ? "apps" : "apps-outline";
                        }

                        return (
                            <Ionicons name={iconName} size={size} color={color} />
                        );
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: "gray",
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Dashboard" component={DashboardScreen} />
                <Tab.Screen name="Campaigns" component={CampaignStackNavigator} />
                <Tab.Screen name="Leads" component={LeadStackNavigator} />
                <Tab.Screen name="Platforms" component={PlatformScreen} />
            </Tab.Navigator>
        </>
    );
};

// Root Navigator
const AppNavigator = () => {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) {
        // Show the loading screen during authentication transitions
        return <LoadingScreen message="Preparing your dashboard..." />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {userToken ? (
                <Stack.Screen name="Main" component={MainNavigator} />
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
            {/* Profile and Legal screens accessible from anywhere */}
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, title: "Profile" }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: true, title: "Privacy Policy" }} />
            <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ headerShown: true, title: "Terms of Service" }} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: true, title: "Delete Account" }} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
