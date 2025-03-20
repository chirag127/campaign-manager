import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
    Linking,
} from "react-native";
import {
    Text,
    Card,
    Title,
    Paragraph,
    Button,
    ActivityIndicator,
    useTheme,
    Switch,
    Divider,
} from "react-native-paper";
import { platformAPI } from "../../api/apiClient";
import { PLATFORMS } from "../../config";
import { API_URL } from "../../config";

const PlatformScreen = () => {
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [connectedPlatforms, setConnectedPlatforms] = useState({});
    const [connectingPlatform, setConnectingPlatform] = useState(null);
    const [processingOAuth, setProcessingOAuth] = useState(false);

    const loadPlatformData = async () => {
        try {
            setLoading(true);

            // Get connected platforms
            const platformsResponse = await platformAPI.getConnectedPlatforms();
            const platformsData = platformsResponse.data.data;
            setConnectedPlatforms(platformsData);
        } catch (error) {
            console.error("Error loading platform data:", error);
            Alert.alert(
                "Error",
                "Failed to load platform data. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Handle deep linking for OAuth callbacks
    const handleDeepLink = async (url) => {
        if (!url || processingOAuth) return;

        try {
            setProcessingOAuth(true);
            console.log("Received deep link:", url);

            // Parse the URL to extract parameters
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);

            const code = params.get("code");
            const state = params.get("state");
            const platform = getPlatformFromState(state);

            console.log(
                "Extracted from URL - code:",
                code ? "present" : "missing",
                "state:",
                state,
                "platform:",
                platform
            );

            if (code && platform) {
                console.log(
                    `Processing OAuth callback for ${platform} with code: ${code.substring(
                        0,
                        10
                    )}...`
                );

                // Call the backend to exchange the code for tokens
                const redirectUri = "https://campaign-manager127.netlify.app";
                console.log(
                    `Calling API to connect platform ${platform.toLowerCase()} with redirect URI ${redirectUri}`
                );
                const response = await platformAPI.connectPlatform(
                    platform.toLowerCase(),
                    code,
                    redirectUri
                );
                console.log("Platform connection response:", response.data);

                // Update the connected platforms state
                const updatedPlatforms = { ...connectedPlatforms };
                updatedPlatforms[platform.toLowerCase()] = true;
                setConnectedPlatforms(updatedPlatforms);

                Alert.alert("Success", `Connected to ${platform}`);
            }
        } catch (error) {
            console.error("Error processing OAuth callback:", error);
            Alert.alert(
                "Error",
                "Failed to complete platform connection. Please try again."
            );
        } finally {
            setProcessingOAuth(false);
            setConnectingPlatform(null);
        }
    };

    // Helper function to extract platform from state parameter
    const getPlatformFromState = (state) => {
        if (!state) return null;

        // Check if the state contains a platform identifier
        // Format: platformId_randomString
        const platforms = [
            "google",
            "facebook",
            "instagram",
            "youtube",
            "linkedin",
            "twitter",
            "snapchat",
        ];

        for (const platform of platforms) {
            if (state.toLowerCase().startsWith(platform + "_")) {
                return platform.toUpperCase();
            }
        }

        // Fallback to the current connecting platform if we can't determine from state
        return connectingPlatform;
    };

    useEffect(() => {
        // Set up deep link listener when component mounts
        const linkingListener = Linking.addEventListener("url", ({ url }) => {
            handleDeepLink(url);
        });

        // Check if app was opened with a deep link
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink(url);
            }
        });

        // Load platform data
        loadPlatformData();

        // Clean up listener when component unmounts
        return () => {
            linkingListener.remove();
        };
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadPlatformData();
    };

    const handleConnect = async (platform) => {
        try {
            setConnectingPlatform(platform.id);

            // Generate a random state for OAuth security
            // Include platform ID in the state to identify it when we get the callback
            const state =
                platform.id.toLowerCase() +
                "_" +
                Math.random().toString(36).substring(2, 15);

            // Redirect URI for the OAuth flow
            const redirectUri = `https://campaign-manager127.netlify.app`;

            // Construct the OAuth URL
            let authUrl = platform.authUrl;

            switch (platform.id) {
                case "FACEBOOK":
                case "INSTAGRAM":
                    authUrl += `?client_id=${
                        process.env.FACEBOOK_APP_ID
                    }&redirect_uri=${encodeURIComponent(
                        redirectUri
                    )}&state=${state}&scope=ads_management,ads_read`;
                    break;
                case "GOOGLE":
                case "YOUTUBE":
                    authUrl += `?client_id=${
                        process.env.GOOGLE_CLIENT_ID
                    }&redirect_uri=${encodeURIComponent(
                        redirectUri
                    )}&response_type=code&state=${state}&scope=https://www.googleapis.com/auth/adwords`;
                    break;
                case "LINKEDIN":
                    authUrl += `?client_id=${
                        process.env.LINKEDIN_CLIENT_ID
                    }&redirect_uri=${encodeURIComponent(
                        redirectUri
                    )}&response_type=code&state=${state}&scope=r_ads`;
                    break;
                case "TWITTER":
                    authUrl += `?client_id=${
                        process.env.TWITTER_API_KEY
                    }&redirect_uri=${encodeURIComponent(
                        redirectUri
                    )}&response_type=code&state=${state}&scope=ads:read ads:write`;
                    break;
                case "SNAPCHAT":
                    authUrl += `?client_id=${
                        process.env.SNAPCHAT_CLIENT_ID
                    }&redirect_uri=${encodeURIComponent(
                        redirectUri
                    )}&response_type=code&state=${state}&scope=snapchat-marketing-api`;
                    break;
                default:
                    throw new Error(`Unsupported platform: ${platform.id}`);
            }

            // Open the OAuth URL in the browser
            const supported = await Linking.canOpenURL(authUrl);

            if (supported) {
                await Linking.openURL(authUrl);

                // The OAuth callback will be handled by the deep link handler
                // We'll keep the connecting platform state until the callback is processed
                Alert.alert(
                    "Authorization",
                    `Please complete the authorization in your browser. The app will update once you've granted permission.`
                );
            } else {
                Alert.alert("Error", `Cannot open URL: ${authUrl}`);
                setConnectingPlatform(null);
            }
        } catch (error) {
            console.error(`Error connecting to ${platform.id}:`, error);
            Alert.alert(
                "Error",
                `Failed to connect to ${platform.name}. Please try again.`
            );
            setConnectingPlatform(null);
        }
    };

    const handleDisconnect = async (platform) => {
        try {
            setConnectingPlatform(platform.id);

            // Call the disconnect API
            await platformAPI.disconnectPlatform(platform.id.toLowerCase());

            // Update the local state
            const updatedPlatforms = { ...connectedPlatforms };
            updatedPlatforms[platform.id.toLowerCase()] = false;
            setConnectedPlatforms(updatedPlatforms);

            Alert.alert("Success", `Disconnected from ${platform.name}`);
        } catch (error) {
            console.error(`Error disconnecting from ${platform.id}:`, error);
            Alert.alert(
                "Error",
                `Failed to disconnect from ${platform.name}. Please try again.`
            );
        } finally {
            setConnectingPlatform(null);
        }
    };

    const toggleConnection = (platform) => {
        if (connectedPlatforms[platform.id.toLowerCase()]) {
            // Confirm before disconnecting
            Alert.alert(
                "Disconnect Platform",
                `Are you sure you want to disconnect from ${platform.name}?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Disconnect",
                        style: "destructive",
                        onPress: () => handleDisconnect(platform),
                    },
                ]
            );
        } else {
            // Connect to the platform
            handleConnect(platform);
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>
                    Loading platform connections...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Title style={styles.headerTitle}>Platform Connections</Title>
                <Paragraph style={styles.headerSubtitle}>
                    Connect your ad accounts to manage campaigns across multiple
                    platforms
                </Paragraph>
            </View>

            {PLATFORMS.map((platform) => (
                <Card key={platform.id} style={styles.platformCard}>
                    <Card.Content>
                        <View style={styles.platformHeader}>
                            <View
                                style={[
                                    styles.platformIcon,
                                    { backgroundColor: platform.color },
                                ]}
                            >
                                <Text style={styles.platformIconText}>
                                    {platform.name.charAt(0)}
                                </Text>
                            </View>
                            <View style={styles.platformInfo}>
                                <Title style={styles.platformName}>
                                    {platform.name}
                                </Title>
                                <Paragraph style={styles.platformDescription}>
                                    {getDescription(platform.id)}
                                </Paragraph>
                            </View>
                            <Switch
                                value={
                                    connectedPlatforms[
                                        platform.id.toLowerCase()
                                    ] || false
                                }
                                onValueChange={() => toggleConnection(platform)}
                                disabled={connectingPlatform === platform.id}
                                color={platform.color}
                            />
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.platformStatus}>
                            <Text style={styles.statusLabel}>Status:</Text>
                            <Text
                                style={[
                                    styles.statusValue,
                                    {
                                        color: connectedPlatforms[
                                            platform.id.toLowerCase()
                                        ]
                                            ? "#4CAF50"
                                            : "#F44336",
                                    },
                                ]}
                            >
                                {connectedPlatforms[platform.id.toLowerCase()]
                                    ? "Connected"
                                    : "Not Connected"}
                            </Text>
                        </View>

                        {connectedPlatforms[platform.id.toLowerCase()] && (
                            <View style={styles.platformFeatures}>
                                <Text style={styles.featuresTitle}>
                                    Available Features:
                                </Text>
                                <View style={styles.featuresList}>
                                    {getFeatures(platform.id).map(
                                        (feature, index) => (
                                            <View
                                                key={index}
                                                style={styles.featureItem}
                                            >
                                                <Text
                                                    style={styles.featureIcon}
                                                >
                                                    ✓
                                                </Text>
                                                <Text
                                                    style={styles.featureText}
                                                >
                                                    {feature}
                                                </Text>
                                            </View>
                                        )
                                    )}
                                </View>
                            </View>
                        )}
                    </Card.Content>
                    <Card.Actions>
                        {connectedPlatforms[platform.id.toLowerCase()] ? (
                            <Button
                                mode="outlined"
                                onPress={() => toggleConnection(platform)}
                                loading={connectingPlatform === platform.id}
                                disabled={connectingPlatform === platform.id}
                                color={platform.color}
                            >
                                Disconnect
                            </Button>
                        ) : (
                            <Button
                                mode="contained"
                                onPress={() => toggleConnection(platform)}
                                loading={connectingPlatform === platform.id}
                                disabled={connectingPlatform === platform.id}
                                style={{ backgroundColor: platform.color }}
                            >
                                Connect
                            </Button>
                        )}
                    </Card.Actions>
                </Card>
            ))}

            <View style={styles.footer} />
        </ScrollView>
    );
};

// Helper function to get platform description
const getDescription = (platformId) => {
    switch (platformId) {
        case "FACEBOOK":
            return "Connect to Facebook Ads to create and manage campaigns on Facebook.";
        case "INSTAGRAM":
            return "Connect to Instagram Ads (via Facebook) to run ads on Instagram.";
        case "GOOGLE":
            return "Connect to Google Ads to manage search and display campaigns.";
        case "YOUTUBE":
            return "Connect to YouTube Ads (via Google) to run video ad campaigns.";
        case "LINKEDIN":
            return "Connect to LinkedIn Marketing Solutions to reach professional audiences.";
        case "TWITTER":
            return "Connect to Twitter Ads to promote tweets and reach Twitter users.";
        case "SNAPCHAT":
            return "Connect to Snapchat Ads to reach younger audiences with creative formats.";
        default:
            return "Connect to manage campaigns on this platform.";
    }
};

// Helper function to get platform features
const getFeatures = (platformId) => {
    const commonFeatures = [
        "Create and manage campaigns",
        "Track performance metrics",
        "Sync leads automatically",
    ];

    switch (platformId) {
        case "FACEBOOK":
            return [
                ...commonFeatures,
                "Target custom audiences",
                "Run ads on Facebook, Messenger, and Audience Network",
            ];
        case "INSTAGRAM":
            return [
                ...commonFeatures,
                "Create Instagram-specific ad formats",
                "Reach Instagram users",
            ];
        case "GOOGLE":
            return [
                ...commonFeatures,
                "Run search and display ads",
                "Target by keywords and interests",
            ];
        case "YOUTUBE":
            return [
                ...commonFeatures,
                "Create video ad campaigns",
                "Target viewers by interests and demographics",
            ];
        case "LINKEDIN":
            return [
                ...commonFeatures,
                "Target by job title, company, and skills",
                "Run ads in the LinkedIn feed",
            ];
        case "TWITTER":
            return [
                ...commonFeatures,
                "Promote tweets and accounts",
                "Target by interests and followers",
            ];
        case "SNAPCHAT":
            return [
                ...commonFeatures,
                "Create Snap Ads and AR experiences",
                "Reach younger demographics",
            ];
        default:
            return commonFeatures;
    }
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
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#666",
    },
    platformCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
    },
    platformHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    platformIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    platformIconText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 24,
    },
    platformInfo: {
        flex: 1,
    },
    platformName: {
        fontSize: 18,
        marginBottom: 3,
    },
    platformDescription: {
        fontSize: 14,
        color: "#666",
    },
    divider: {
        marginVertical: 15,
    },
    platformStatus: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    statusLabel: {
        fontWeight: "bold",
        marginRight: 5,
    },
    statusValue: {
        fontWeight: "bold",
    },
    platformFeatures: {
        marginTop: 10,
    },
    featuresTitle: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    featuresList: {
        marginLeft: 5,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    featureIcon: {
        color: "#4CAF50",
        marginRight: 5,
        fontWeight: "bold",
    },
    featureText: {
        fontSize: 14,
    },
    footer: {
        height: 20,
    },
});

export default PlatformScreen;
