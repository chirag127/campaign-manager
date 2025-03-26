import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Linking,
    Alert,
    Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import showDialog from "../../utils/showDialog";
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

// process.env.FACEBOOK_APP_ID is undefined
// require("dotenv").config();

const PlatformScreen = () => {
    const theme = useTheme();
    const route = useRoute();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [connectedPlatforms, setConnectedPlatforms] = useState({});
    const [connectingPlatform, setConnectingPlatform] = useState(null);

    // Parse URL query parameters for error codes and messages or OAuth callback
    useEffect(() => {
        // Flag to prevent multiple processing of the same callback
        const hasProcessedCallback = localStorage.getItem('hasProcessedCallback');
        const parseUrlParams = async () => {
            try {
                // Get the current URL
                const url = window.location.href;
                const urlObj = new URL(url);

                // Check if we've already processed this callback
                if (urlObj.searchParams.has('code') && hasProcessedCallback === 'true') {
                    console.log('Skipping OAuth callback processing - already processed');
                    // Clean up the URL to prevent further processing
                    const cleanUrl = url.split('?')[0];
                    window.history.replaceState({}, document.title, cleanUrl);
                    return;
                }

                // Check for error parameters
                const errorCode = urlObj.searchParams.get('error_code');
                const errorMessage = urlObj.searchParams.get('error_message');

                if (errorCode && errorMessage) {
                    // Decode the error message (it's URL encoded)
                    const decodedMessage = decodeURIComponent(errorMessage);

                    console.log('Facebook error detected:', { errorCode, errorMessage: decodedMessage });

                    // Show dialog with error information
                    showDialog(
                        'Facebook Connection Error',
                        `Error Code: ${errorCode}\n\nError Message: ${decodedMessage}\n\nPlease make sure your Facebook app is properly configured.`
                    );

                    // Clean up the URL to remove error parameters
                    // This prevents showing the same error multiple times if the user refreshes
                    const cleanUrl = url.split('?')[0];
                    window.history.replaceState({}, document.title, cleanUrl);
                    return;
                }

                // Check for OAuth callback parameters
                const code = urlObj.searchParams.get('code');
                const state = urlObj.searchParams.get('state');

                // Log all URL parameters for debugging
                console.log('URL parameters:', {
                    full_url: url,
                    all_params: Object.fromEntries(urlObj.searchParams.entries()),
                    code: code,
                    state: state
                });

                if (code) {
                    // Set flag to prevent multiple processing
                    localStorage.setItem('hasProcessedCallback', 'true');
                    console.log('Detected OAuth callback in URL parameters');

                    // Determine which platform is being connected
                    // Default to Facebook since that's what we're fixing
                    const platform = 'facebook';

                    // Set connecting platform state for UI feedback
                    setConnectingPlatform('FACEBOOK');

                    // Redirect URI must match exactly what was used in the authorization request
                    const redirectUri = `https://campaign-manager1271.netlify.app/platforms`;

                    try {
                        console.log('Sending code to backend for platform:', platform);

                        // Call the backend API to exchange the code for an access token
                        const response = await platformAPI.connectPlatform(platform, code, redirectUri);

                        console.log('Platform connection response:', response.data);

                        // Update the UI to show the platform is connected
                        const updatedPlatforms = { ...connectedPlatforms };
                        updatedPlatforms[platform] = true;
                        setConnectedPlatforms(updatedPlatforms);

                        // Show success message
                        showDialog('Success', `Connected to ${platform.toUpperCase()}`);

                        // Clean up the URL to remove OAuth parameters
                        const cleanUrl = url.split('?')[0];
                        window.history.replaceState({}, document.title, cleanUrl);

                        // Refresh platform data to ensure UI is up to date
                        loadPlatformData();
                    } catch (apiError) {
                        console.error('Error connecting to platform:', apiError);

                        let errorMessage = 'Failed to complete platform connection. ';

                        // Extract more detailed error information if available
                        if (apiError.response?.data?.message) {
                            errorMessage += apiError.response.data.message;
                        } else if (apiError.request) {
                            // The request was made but no response was received
                            errorMessage += 'No response received from server. Please check your internet connection.';
                        } else {
                            // Something happened in setting up the request
                            errorMessage += `Error: ${apiError.message}`;
                        }

                        showDialog('Connection Error', errorMessage);

                        // Clean up the URL even on error
                        const cleanUrl = url.split('?')[0];
                        window.history.replaceState({}, document.title, cleanUrl);
                    }

                    // Reset connecting state
                    setConnectingPlatform(null);
                }
            } catch (error) {
                console.error('Error parsing URL parameters:', error);
                showDialog('Error', 'Failed to process authentication response. Please try again.');
                setConnectingPlatform(null);

                // Clean up the URL on error
                try {
                    const cleanUrl = window.location.href.split('?')[0];
                    window.history.replaceState({}, document.title, cleanUrl);
                } catch (e) {
                    console.error('Error cleaning URL:', e);
                }
            } finally {
                // Clear the processing flag after a delay to ensure we don't process the same callback again
                // but allow future callbacks to be processed
                setTimeout(() => {
                    localStorage.removeItem('hasProcessedCallback');
                }, 5000);
            }
        };

        // Only run on web platform
        if (Platform.OS === 'web') {
            parseUrlParams();
        }

        // Cleanup function to ensure we don't leave stale flags
        return () => {
            if (Platform.OS === 'web') {
                localStorage.removeItem('hasProcessedCallback');
            }
        };
    }, []);

    // Handle OAuth callback parameters if they exist in the route
    // This is a secondary handler that will only run if the URL parameter handler didn't catch the callback
    useEffect(() => {
        // Skip if we've already processed a callback via URL parameters
        if (localStorage.getItem('hasProcessedCallback') === 'true') {
            return;
        }
        const handleOAuthCallback = async () => {
            try {
                // Check for error parameters in route.params
                if (route.params?.error_code && route.params?.error_message) {
                    const { error_code, error_message } = route.params;
                    console.log('Facebook error detected in route params:', { error_code, error_message });

                    // Decode the error message (it's URL encoded)
                    const decodedMessage = decodeURIComponent(error_message);

                    // Show dialog with error information
                    showDialog(
                        'Facebook Connection Error',
                        `Error Code: ${error_code}\n\nError Message: ${decodedMessage}\n\nPlease make sure your Facebook app is properly configured.`
                    );

                    // Reset connecting state
                    setConnectingPlatform(null);
                    return;
                }

                // Log all route parameters for debugging
                console.log('Route parameters:', route.params);

                // Check if we have code parameter from OAuth callback
                if (route.params?.code) {
                    // Set flag to prevent multiple processing
                    localStorage.setItem('hasProcessedCallback', 'true');
                    const { code } = route.params;
                    const { state } = route.params || {};
                    console.log('Received OAuth callback in route params:', { code, state });

                    // Get the platform ID that was being connected
                    // Default to Facebook since that's what we're fixing
                    const platform = 'facebook';

                    // Set connecting platform state for UI feedback
                    setConnectingPlatform('FACEBOOK');

                    // Redirect URI must match exactly what was used in the authorization request
                    const redirectUri = `https://campaign-manager1271.netlify.app/platforms`;

                    try {
                        console.log('Sending code to backend for platform:', platform);

                        // Call the backend API to exchange the code for an access token
                        const response = await platformAPI.connectPlatform(platform, code, redirectUri);

                        console.log('Platform connection response:', response.data);

                        // Update the UI to show the platform is connected
                        const updatedPlatforms = { ...connectedPlatforms };
                        updatedPlatforms[platform] = true;
                        setConnectedPlatforms(updatedPlatforms);

                        // Show success message
                        showDialog('Success', `Connected to ${platform.toUpperCase()}`);

                        // Refresh platform data to ensure UI is up to date
                        loadPlatformData();
                    } catch (apiError) {
                        console.error('Error connecting to platform:', apiError);

                        let errorMessage = 'Failed to complete platform connection. ';

                        // Extract more detailed error information if available
                        if (apiError.response?.data?.message) {
                            errorMessage += apiError.response.data.message;
                        } else if (apiError.request) {
                            // The request was made but no response was received
                            errorMessage += 'No response received from server. Please check your internet connection.';
                        } else {
                            // Something happened in setting up the request
                            errorMessage += `Error: ${apiError.message}`;
                        }

                        showDialog('Connection Error', errorMessage);
                    }

                    // Reset connecting state
                    setConnectingPlatform(null);
                }
            } catch (error) {
                console.error('Error handling OAuth callback:', error);
                showDialog('Error', 'Failed to complete authentication. Please try again.');
                setConnectingPlatform(null);
            } finally {
                // Clear the processing flag after a delay
                setTimeout(() => {
                    localStorage.removeItem('hasProcessedCallback');
                }, 5000);
            }
        };

        if (route.params?.code) {
            handleOAuthCallback();
        }
    }, [route.params]);

    const loadPlatformData = async () => {
        try {
            setLoading(true);

            // Get connected platforms
            try {
                const platformsResponse =
                    await platformAPI.getConnectedPlatforms();
                const platformsData = platformsResponse.data.data || {
                    facebook: false,
                    google: false,
                    linkedin: false,
                    twitter: false,
                    snapchat: false,
                };
                setConnectedPlatforms(platformsData);
            } catch (error) {
                console.error("Error loading platform data:", error);
                // Set default values if API call fails
                setConnectedPlatforms({
                    facebook: false,
                    google: false,
                    linkedin: false,
                    twitter: false,
                    snapchat: false,
                });

                // Show error dialog but don't block the UI
                showDialog(
                    "Connection Error",
                    "Could not load platform connection status. Using default values."
                );
            }
        } catch (error) {
            console.error("Unexpected error in loadPlatformData:", error);
            showDialog(
                "Error",
                "Failed to load platform data. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadPlatformData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadPlatformData();
    };

    const handleConnect = async (platform) => {
        try {
            setConnectingPlatform(platform.id);

            // For Facebook and Instagram, check configuration status first
            if (platform.id === 'FACEBOOK' || platform.id === 'INSTAGRAM') {
                try {
                    console.log('Checking Facebook configuration status...');
                    const configResponse = await platformAPI.checkFacebookConfigStatus();
                    console.log('Facebook config status:', configResponse.data);

                    if (!configResponse.data.data.app_id_configured || !configResponse.data.data.app_secret_configured) {
                        showDialog(
                            'Facebook Configuration Error',
                            'The server is missing Facebook API credentials. Please contact the administrator.'
                        );
                        setConnectingPlatform(null);
                        return;
                    }

                    if (!configResponse.data.data.frontend_app_id_match) {
                        showDialog(
                            'Facebook Configuration Mismatch',
                            'The Facebook App ID used in the frontend does not match the one configured on the server.'
                        );
                        // Continue anyway as it might still work
                    }
                } catch (configError) {
                    console.error('Error checking Facebook configuration:', configError);
                    showDialog(
                        'Configuration Check Failed',
                        'Could not verify Facebook configuration. The connection may not work properly.'
                    );
                    // Continue anyway
                }
            }

            // Generate a random state for OAuth security
            const state = Math.random().toString(36).substring(2, 15);

            // Store the state in localStorage for Facebook to retrieve it later
            if (Platform.OS === 'web' && (platform.id === 'FACEBOOK' || platform.id === 'INSTAGRAM')) {
                localStorage.setItem('facebookAuthState', state);
                console.log('Stored Facebook auth state in localStorage:', state);
            }

            // Redirect URI for the OAuth flow - must match exactly what's in Facebook App settings
            // Including the trailing slash if that's how you configured it in Facebook
            const redirectUri = `https://campaign-manager1271.netlify.app/platforms`;

            console.log('Using redirect URI:', redirectUri);

            // Construct the OAuth URL
            let authUrl = platform.authUrl;

            switch (platform.id) {
                case "FACEBOOK":
                case "INSTAGRAM":
                    // Make sure state is properly encoded
                    const encodedState = encodeURIComponent(state);

                    // Build the URL with explicit parameter ordering and encoding
                    authUrl += '?client_id=512708801911830' +
                              '&redirect_uri=' + encodeURIComponent(redirectUri) +
                              '&state=' + encodedState +
                              '&scope=ads_management,ads_read' +
                              '&config_id=1629488587771756' +
                              '&response_type=code';
                    console.log('Facebook Auth URL:', authUrl);
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

            // Store the platform ID being connected for use in the callback
            // This is important for the OAuth callback to know which platform was being connected
            global.connectingPlatformId = platform.id;

            // Open the OAuth URL in the browser
            const supported = await Linking.canOpenURL(authUrl);

            if (supported) {
                console.log(`Opening auth URL for ${platform.id}...`);
                await Linking.openURL(authUrl);

                // We'll no longer simulate success here as we'll handle the real callback
                // The OAuth callback will be handled by the useEffect we added earlier

                // Show a message to the user that they need to complete authentication in the browser
                showDialog(
                    "Authentication Started",
                    `Please complete the authentication process in your browser for ${platform.name}.`
                );
            } else {
                console.error(`Cannot open URL: ${authUrl}`);
                showDialog("Error", `Cannot open authentication URL. Please check your internet connection and try again.`);
                setConnectingPlatform(null);

                // Clean up stored state on error
                if (Platform.OS === 'web' && (platform.id === 'FACEBOOK' || platform.id === 'INSTAGRAM')) {
                    localStorage.removeItem('facebookAuthState');
                }
            }
        } catch (error) {
            console.error(`Error connecting to ${platform.id}:`, error);
            showDialog(
                "Error",
                `Failed to connect to ${platform.name}. Error: ${error.message}`
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

            showDialog("Success", `Disconnected from ${platform.name}`);
        } catch (error) {
            console.error(`Error disconnecting from ${platform.id}:`, error);
            showDialog(
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
            showDialog(
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
