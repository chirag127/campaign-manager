import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import showDialog from "../../utils/showDialog";
import { useNavigation } from "@react-navigation/native";
import {
    Text,
    Card,
    Title,
    TextInput,
    Button,
    Avatar,
    Divider,
    Switch,
    useTheme,
    ActivityIndicator,
} from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import { campaignAPI, leadAPI } from "../../api/apiClient";
import { Platform } from "react-native";

const ProfileScreen = () => {
    const { user, updateProfile, logout } = useContext(AuthContext);
    const theme = useTheme();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalLeads: 0,
        totalSpend: 0,
    });

    // Form state
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Load user stats
    useEffect(() => {
        const loadUserStats = async () => {
            try {
                setLoading(true);

                // Get campaigns
                const campaignsResponse = await campaignAPI.getCampaigns();
                const campaignsData = campaignsResponse.data.data;

                // Get leads
                const leadsResponse = await leadAPI.getLeads();
                const leadsData = leadsResponse.data.data;

                // Calculate stats
                const totalCampaigns = campaignsData.length;
                const activeCampaigns = campaignsData.filter(
                    (c) => c.status === "ACTIVE"
                ).length;
                const totalLeads = leadsData.length;

                let totalSpend = 0;
                campaignsData.forEach((campaign) => {
                    campaign.platforms.forEach((platform) => {
                        totalSpend += platform.metrics?.spend || 0;
                    });
                });

                setStats({
                    totalCampaigns,
                    activeCampaigns,
                    totalLeads,
                    totalSpend,
                });
            } catch (error) {
                console.error("Error loading user stats:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUserStats();
    }, []);

    const handleUpdateProfile = async () => {
        // Validate form
        if (!name.trim()) {
            showDialog("Error", "Please enter your name");
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            showDialog("Error", "Passwords do not match");
            return;
        }

        if (newPassword && newPassword.length < 6) {
            showDialog("Error", "Password must be at least 6 characters");
            return;
        }

        try {
            setSubmitting(true);

            const userData = {
                name,
                // Only include password fields if changing password
                ...(newPassword && currentPassword
                    ? {
                          currentPassword,
                          newPassword,
                      }
                    : {}),
            };

            const success = await updateProfile(userData);

            if (success) {
                showDialog("Success", "Profile updated successfully");
                // Clear password fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showDialog("Error", "Failed to update profile. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        // showDialog("Logout", "Are you sure you want to logout?", [
        //     { text: "Cancel", style: "cancel" },
        //     {
        //         text: "Logout",
        //         onPress: async () => {
        //             await logout();
        //         },
        //     },
        // ]);
        console.log("platform", Platform.OS);
        await logout();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading profile data...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar.Text
                    size={80}
                    label={user?.name?.charAt(0) || "U"}
                    backgroundColor={theme.colors.primary}
                />
                <Title style={styles.headerTitle}>{user?.name}</Title>
                <Text style={styles.headerSubtitle}>{user?.email}</Text>
            </View>

            <Card style={styles.statsCard}>
                <Card.Content>
                    <Title style={styles.statsTitle}>Account Overview</Title>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {stats.totalCampaigns}
                            </Text>
                            <Text style={styles.statLabel}>
                                Total Campaigns
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {stats.activeCampaigns}
                            </Text>
                            <Text style={styles.statLabel}>
                                Active Campaigns
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {stats.totalLeads}
                            </Text>
                            <Text style={styles.statLabel}>Total Leads</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                ${stats.totalSpend.toFixed(2)}
                            </Text>
                            <Text style={styles.statLabel}>Total Spend</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.profileCard}>
                <Card.Content>
                    <Title style={styles.cardTitle}>Profile Information</Title>

                    <TextInput
                        label="Name"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Email"
                        value={email}
                        mode="outlined"
                        style={styles.input}
                        disabled
                    />

                    <Divider style={styles.divider} />

                    <Title style={styles.cardTitle}>Change Password</Title>

                    <TextInput
                        label="Current Password"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />

                    <TextInput
                        label="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={!showPassword}
                    />

                    <TextInput
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={!showPassword}
                    />

                    <Divider style={styles.divider} />

                    <Title style={styles.cardTitle}>
                        Notification Settings
                    </Title>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>
                                Email Notifications
                            </Text>
                            <Text style={styles.settingDescription}>
                                Receive email notifications about campaign
                                performance and new leads
                            </Text>
                        </View>
                        <Switch
                            value={emailNotifications}
                            onValueChange={setEmailNotifications}
                            color={theme.colors.primary}
                        />
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button
                        mode="contained"
                        onPress={handleUpdateProfile}
                        style={styles.updateButton}
                        loading={submitting}
                        disabled={submitting}
                    >
                        Update Profile
                    </Button>
                </Card.Actions>
            </Card>

            <Card style={styles.legalCard}>
                <Card.Content>
                    <Title style={styles.cardTitle}>Legal</Title>
                    
                    <Button
                        mode="text"
                        icon="shield-account"
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                        style={styles.legalButton}
                    >
                        Privacy Policy
                    </Button>
                    
                    <Button
                        mode="text"
                        icon="file-document"
                        onPress={() => navigation.navigate('TermsOfService')}
                        style={styles.legalButton}
                    >
                        Terms of Service
                    </Button>
                </Card.Content>
            </Card>

            <Button
                mode="outlined"
                onPress={handleLogout}
                style={styles.logoutButton}
                color="#F44336"
            >
                Logout
            </Button>

            <View style={styles.footer} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
    },
    header: {
        alignItems: "center",
        padding: 20,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 24,
        marginTop: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#666",
    },
    statsCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    statsTitle: {
        fontSize: 18,
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    statItem: {
        width: "48%",
        alignItems: "center",
        marginBottom: 15,
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 5,
        elevation: 1,
    },
    statValue: {
        fontWeight: "bold",
        fontSize: 18,
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 5,
    },
    profileCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        marginBottom: 15,
    },
    input: {
        marginBottom: 15,
    },
    divider: {
        marginVertical: 20,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        marginBottom: 3,
    },
    settingDescription: {
        fontSize: 14,
        color: "#666",
    },
    updateButton: {
        width: "100%",
    },
    logoutButton: {
        marginHorizontal: 15,
        marginBottom: 30,
        borderColor: "#F44336",
    },
    footer: {
        height: 20,
    },
    legalCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    legalButton: {
        marginBottom: 10,
    },
});

export default ProfileScreen;
