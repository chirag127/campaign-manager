const axios = require("axios");
const { google } = require("googleapis");

// Exchange authorization code for access token
exports.exchangeCodeForTokens = async (code, redirectUri) => {
    try {
        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri
        );

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

        return {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt,
        };
    } catch (error) {
        console.error(
            "Error exchanging code for Google tokens:",
            error.message
        );
        throw new Error("Failed to exchange code for Google tokens");
    }
};

// Create a campaign on Google Ads
exports.createCampaign = async (campaign, user) => {
    try {
        // Check if user has connected to Google
        if (!user.platformCredentials.google?.isConnected) {
            throw new Error("User not connected to Google");
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        // Set credentials
        oauth2Client.setCredentials({
            access_token: user.platformCredentials.google.accessToken,
            refresh_token: user.platformCredentials.google.refreshToken,
        });

        // Create Google Ads API client
        const googleAdsClient = new google.ads({
            version: "v17",
            auth: oauth2Client,
        });

        // Get customer ID (assuming user has already set up Google Ads account)
        // In a real implementation, you would store the customer ID with the user
        const customerId = "1234567890"; // This would come from user's stored data

        // Create campaign
        const response = await googleAdsClient.customers.campaigns.create({
            parent: `customers/${customerId}`,
            campaign: {
                name: campaign.name,
                status: campaign.status === "ACTIVE" ? "ENABLED" : "PAUSED",
                advertisingChannelType: mapChannelTypeToGoogle(
                    campaign.objective
                ),
                campaignBudget: {
                    amountMicros: campaign.budget.daily * 1000000, // Convert to micros (millionths)
                    deliveryMethod: "STANDARD",
                },
                targetSpend: {
                    cpcBidCeilingMicros: 1000000, // $1 default
                },
                startDate: formatDateForGoogle(campaign.startDate),
                endDate: campaign.endDate
                    ? formatDateForGoogle(campaign.endDate)
                    : undefined,
            },
        });

        return response.resourceName.split("/").pop(); // Extract campaign ID
    } catch (error) {
        console.error("Error creating Google campaign:", error.message);
        throw new Error("Failed to create Google campaign");
    }
};

// Update a campaign on Google Ads
exports.updateCampaign = async (platformCampaignId, campaign, user) => {
    try {
        // Check if user has connected to Google
        if (!user.platformCredentials.google?.isConnected) {
            throw new Error("User not connected to Google");
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        // Set credentials
        oauth2Client.setCredentials({
            access_token: user.platformCredentials.google.accessToken,
            refresh_token: user.platformCredentials.google.refreshToken,
        });

        // Create Google Ads API client
        const googleAdsClient = new google.ads({
            version: "v17",
            auth: oauth2Client,
        });

        // Get customer ID (assuming user has already set up Google Ads account)
        const customerId = "1234567890"; // This would come from user's stored data

        // Update campaign
        await googleAdsClient.customers.campaigns.update({
            updateMask: "name,status,end_date",
            campaign: {
                resourceName: `customers/${customerId}/campaigns/${platformCampaignId}`,
                name: campaign.name,
                status: campaign.status === "ACTIVE" ? "ENABLED" : "PAUSED",
                endDate: campaign.endDate
                    ? formatDateForGoogle(campaign.endDate)
                    : undefined,
            },
        });

        return true;
    } catch (error) {
        console.error("Error updating Google campaign:", error.message);
        throw new Error("Failed to update Google campaign");
    }
};

// Delete a campaign on Google Ads
exports.deleteCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Google
        if (!user.platformCredentials.google?.isConnected) {
            throw new Error("User not connected to Google");
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        // Set credentials
        oauth2Client.setCredentials({
            access_token: user.platformCredentials.google.accessToken,
            refresh_token: user.platformCredentials.google.refreshToken,
        });

        // Create Google Ads API client
        const googleAdsClient = new google.ads({
            version: "v17",
            auth: oauth2Client,
        });

        // Get customer ID
        const customerId = "1234567890"; // This would come from user's stored data

        // Remove campaign (set status to REMOVED)
        await googleAdsClient.customers.campaigns.update({
            updateMask: "status",
            campaign: {
                resourceName: `customers/${customerId}/campaigns/${platformCampaignId}`,
                status: "REMOVED",
            },
        });

        return true;
    } catch (error) {
        console.error("Error deleting Google campaign:", error.message);
        throw new Error("Failed to delete Google campaign");
    }
};

// Get campaign metrics from Google Ads
exports.getCampaignMetrics = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Google
        if (!user.platformCredentials.google?.isConnected) {
            throw new Error("User not connected to Google");
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        // Set credentials
        oauth2Client.setCredentials({
            access_token: user.platformCredentials.google.accessToken,
            refresh_token: user.platformCredentials.google.refreshToken,
        });

        // Create Google Ads API client
        const googleAdsClient = new google.ads({
            version: "v17",
            auth: oauth2Client,
        });

        // Get customer ID
        const customerId = "1234567890"; // This would come from user's stored data

        // Query campaign metrics
        const response = await googleAdsClient.customers.googleAds.search({
            customerId,
            query: `
        SELECT
          campaign.id,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.cost_micros,
          metrics.ctr,
          metrics.average_cpc,
          metrics.average_cpm
        FROM campaign
        WHERE campaign.id = ${platformCampaignId}
      `,
        });

        if (!response.results || response.results.length === 0) {
            return {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                spend: 0,
                ctr: 0,
                cpc: 0,
                cpm: 0,
            };
        }

        const metrics = response.results[0].metrics;

        return {
            impressions: parseInt(metrics.impressions || 0),
            clicks: parseInt(metrics.clicks || 0),
            conversions: parseInt(metrics.conversions || 0),
            spend: parseFloat(metrics.costMicros || 0) / 1000000, // Convert from micros
            ctr: parseFloat(metrics.ctr || 0),
            cpc: parseFloat(metrics.averageCpc || 0) / 1000000, // Convert from micros
            cpm: parseFloat(metrics.averageCpm || 0) / 1000000, // Convert from micros
        };
    } catch (error) {
        console.error("Error getting Google campaign metrics:", error.message);
        throw new Error("Failed to get Google campaign metrics");
    }
};

// Get campaign leads from Google Ads
exports.getCampaignLeads = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Google
        if (!user.platformCredentials.google?.isConnected) {
            throw new Error("User not connected to Google");
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        // Set credentials
        oauth2Client.setCredentials({
            access_token: user.platformCredentials.google.accessToken,
            refresh_token: user.platformCredentials.google.refreshToken,
        });

        // Create Google Ads API client
        const googleAdsClient = new google.ads({
            version: "v17",
            auth: oauth2Client,
        });

        // Get customer ID
        const customerId = "1234567890"; // This would come from user's stored data

        // Query lead form submissions
        // Note: This is a simplified example. In reality, you would need to set up
        // lead form extensions and query them specifically.
        const response = await googleAdsClient.customers.googleAds.search({
            customerId,
            query: `
        SELECT
          campaign.id,
          extension_feed_item.id,
          extension_feed_item.extension_type,
          extension_feed_item.lead_form_extension.lead_form_submissions
        FROM extension_feed_item
        WHERE campaign.id = ${platformCampaignId}
          AND extension_feed_item.extension_type = LEAD_FORM
      `,
        });

        if (!response.results || response.results.length === 0) {
            return [];
        }

        // Process leads
        const leads = [];
        for (const result of response.results) {
            const submissions =
                result.extensionFeedItem.leadFormExtension.leadFormSubmissions;

            for (const submission of submissions) {
                leads.push({
                    firstName: submission.firstName || "",
                    lastName: submission.lastName || "",
                    email: submission.email || "",
                    phone: submission.phoneNumber || "",
                    adId: result.extensionFeedItem.id,
                    additionalInfo: new Map(
                        Object.entries(submission.customQuestions || {})
                    ),
                });
            }
        }

        return leads;
    } catch (error) {
        console.error("Error getting Google campaign leads:", error.message);
        throw new Error("Failed to get Google campaign leads");
    }
};

// Helper function to map our objectives to Google's advertising channel types
function mapChannelTypeToGoogle(objective) {
    const mapping = {
        BRAND_AWARENESS: "DISPLAY",
        REACH: "DISPLAY",
        TRAFFIC: "SEARCH",
        ENGAGEMENT: "DISPLAY",
        APP_INSTALLS: "MULTI_CHANNEL",
        VIDEO_VIEWS: "VIDEO",
        LEAD_GENERATION: "SEARCH",
        CONVERSIONS: "SEARCH",
        CATALOG_SALES: "SHOPPING",
        STORE_TRAFFIC: "SEARCH",
    };

    return mapping[objective] || "SEARCH";
}

// Helper function to format date for Google Ads API (YYYYMMDD)
function formatDateForGoogle(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}${month}${day}`;
}
