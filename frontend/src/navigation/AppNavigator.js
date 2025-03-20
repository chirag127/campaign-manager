import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// Main Screens
import DashboardScreen from "../screens/DashboardScreen";
import CampaignListScreen from "../screens/campaigns/CampaignListScreen";
import CampaignDetailScreen from "../screens/campaigns/CampaignDetailScreen";
import CampaignCreateScreen from "../screens/campaigns/CampaignCreateScreen";
import LeadListScreen from "../screens/leads/LeadListScreen";
import LeadDetailScreen from "../screens/leads/LeadDetailScreen";
import PlatformScreen from "../screens/platforms/PlatformScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Context
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

// Campaign Stack Navigator
const CampaignStackNavigator = () => (
    <Stack.Navigator>
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

// Main Tab Navigator
const MainNavigator = () => {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
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
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
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
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

// Root Navigator
const AppNavigator = () => {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) {
        // You could return a loading screen here
        return null;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {userToken ? (
                <Stack.Screen name="Main" component={MainNavigator} />
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
