const Platform = require("../models/Platform");
const User = require("../models/User");
const platformServices = require("../services");

// @desc    Get all platforms
// @route   GET /api/platforms
// @access  Private
exports.getPlatforms = async (req, res) => {
    try {
        const platforms = await Platform.find();

        res.status(200).json({
            success: true,
            count: platforms.length,
            data: platforms,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single platform
// @route   GET /api/platforms/:id
// @access  Private
exports.getPlatform = async (req, res) => {
    try {
        // Special case for 'connected' - this is a fallback in case the route order doesn't work
        if (req.params.id === "connected") {
            return exports.getConnectedPlatforms(req, res);
        }

        const platform = await Platform.findById(req.params.id);

        if (!platform) {
            return res.status(404).json({
                success: false,
                message: `Platform not found with id of ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            data: platform,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Connect user to platform
// @route   POST /api/platforms/:platform/connect
// @access  Private
exports.connectPlatform = async (req, res) => {
    try {
        const { platform } = req.params;
        const { code, redirectUri } = req.body;

        // Validate platform
        const validPlatforms = [
            "facebook",
            "google",
            "linkedin",
            "twitter",
            "snapchat",
        ];
        if (!validPlatforms.includes(platform.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Invalid platform: ${platform}`,
            });
        }

        // Get the appropriate service for the platform
        const service = platformServices[platform.toLowerCase()];

        if (!service) {
            return res.status(500).json({
                success: false,
                message: `Service not available for platform: ${platform}`,
            });
        }

        // Exchange authorization code for tokens
        const tokens = await service.exchangeCodeForTokens(code, redirectUri);

        if (!tokens) {
            return res.status(400).json({
                success: false,
                message: "Failed to exchange code for tokens",
            });
        }

        // Update user's platform credentials
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update the appropriate platform credentials
        switch (platform.toLowerCase()) {
            case "facebook":
                user.platformCredentials.facebook = {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    expiresAt: tokens.expiresAt,
                    isConnected: true,
                };
                break;
            case "google":
                user.platformCredentials.google = {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    expiresAt: tokens.expiresAt,
                    isConnected: true,
                };
                break;
            case "linkedin":
                user.platformCredentials.linkedin = {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    expiresAt: tokens.expiresAt,
                    isConnected: true,
                };
                break;
            case "twitter":
                user.platformCredentials.twitter = {
                    accessToken: tokens.accessToken,
                    accessTokenSecret: tokens.accessTokenSecret,
                    isConnected: true,
                };
                break;
            case "snapchat":
                user.platformCredentials.snapchat = {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    expiresAt: tokens.expiresAt,
                    isConnected: true,
                };
                break;
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                message: `Successfully connected to ${platform}`,
                platform,
            },
        });
    } catch (error) {
        console.error(`Error connecting to ${platform} platform:`, error);

        // Determine appropriate status code based on the error
        let statusCode = 500;
        if (error.message.includes('Invalid platform') ||
            error.message.includes('Failed to exchange code')) {
            statusCode = 400;
        }

        // Send detailed error response
        res.status(statusCode).json({
            success: false,
            message: error.message,
            platform: platform,
            // Include additional details if available
            details: error.details || null
        });
    }
};

// @desc    Disconnect user from platform
// @route   POST /api/platforms/:platform/disconnect
// @access  Private
exports.disconnectPlatform = async (req, res) => {
    try {
        const { platform } = req.params;

        // Validate platform
        const validPlatforms = [
            "facebook",
            "google",
            "linkedin",
            "twitter",
            "snapchat",
        ];
        if (!validPlatforms.includes(platform.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Invalid platform: ${platform}`,
            });
        }

        // Update user's platform credentials
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update the appropriate platform credentials
        switch (platform.toLowerCase()) {
            case "facebook":
                user.platformCredentials.facebook = {
                    accessToken: null,
                    refreshToken: null,
                    expiresAt: null,
                    isConnected: false,
                };
                break;
            case "google":
                user.platformCredentials.google = {
                    accessToken: null,
                    refreshToken: null,
                    expiresAt: null,
                    isConnected: false,
                };
                break;
            case "linkedin":
                user.platformCredentials.linkedin = {
                    accessToken: null,
                    refreshToken: null,
                    expiresAt: null,
                    isConnected: false,
                };
                break;
            case "twitter":
                user.platformCredentials.twitter = {
                    accessToken: null,
                    accessTokenSecret: null,
                    isConnected: false,
                };
                break;
            case "snapchat":
                user.platformCredentials.snapchat = {
                    accessToken: null,
                    refreshToken: null,
                    expiresAt: null,
                    isConnected: false,
                };
                break;
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                message: `Successfully disconnected from ${platform}`,
                platform,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get Facebook configuration status
// @route   GET /api/platforms/facebook/config-status
// @access  Public
exports.getFacebookConfigStatus = async (req, res) => {
    try {
        // Check if Facebook App ID is configured
        const appIdConfigured = !!process.env.FACEBOOK_APP_ID;

        // Check if Facebook App Secret is configured
        const appSecretConfigured = !!process.env.FACEBOOK_APP_SECRET;

        // Check if the App ID in the backend matches the one used in the frontend
        const frontendAppId = "512708801911830"; // This is hardcoded in the frontend
        const frontendAppIdMatch = process.env.FACEBOOK_APP_ID === frontendAppId;

        // Log the configuration status for debugging
        console.log('Facebook configuration status:', {
            app_id_configured: appIdConfigured,
            app_secret_configured: appSecretConfigured,
            frontend_app_id_match: frontendAppIdMatch,
            backend_app_id: process.env.FACEBOOK_APP_ID || 'not set'
        });

        res.status(200).json({
            success: true,
            data: {
                app_id_configured: appIdConfigured,
                app_secret_configured: appSecretConfigured,
                frontend_app_id_match: frontendAppIdMatch
            }
        });
    } catch (error) {
        console.error("Error in getFacebookConfigStatus:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An unexpected error occurred"
        });
    }
};

// @desc    Get user's connected platforms
// @route   GET /api/platforms/connected
// @access  Private
exports.getConnectedPlatforms = async (req, res) => {
    try {
        // Check if req.user exists
        if (!req.user || !req.user.id) {
            console.error("User not available in request object:", req.user);
            return res.status(401).json({
                success: false,
                message: "Authentication failed. Please login again.",
            });
        }

        // Log the user ID for debugging
        console.log(`Fetching connected platforms for user ID: ${req.user.id}`);

        const user = await User.findById(req.user.id);

        if (!user) {
            console.error(`User not found with ID: ${req.user.id}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if platformCredentials exists
        if (!user.platformCredentials) {
            console.warn(`User ${req.user.id} has no platformCredentials`);
            // Return default values if platformCredentials doesn't exist
            return res.status(200).json({
                success: true,
                data: {
                    facebook: false,
                    google: false,
                    linkedin: false,
                    twitter: false,
                    snapchat: false,
                },
            });
        }

        const connectedPlatforms = {
            facebook: user.platformCredentials.facebook?.isConnected || false,
            google: user.platformCredentials.google?.isConnected || false,
            linkedin: user.platformCredentials.linkedin?.isConnected || false,
            twitter: user.platformCredentials.twitter?.isConnected || false,
            snapchat: user.platformCredentials.snapchat?.isConnected || false,
        };

        res.status(200).json({
            success: true,
            data: connectedPlatforms,
        });
    } catch (error) {
        console.error("Error in getConnectedPlatforms:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An unexpected error occurred",
        });
    }
};
