const { google } = require("googleapis");
const googleService = require("./googleService");

// YouTube uses Google Ads API for advertising, but with some specific settings
// Most methods are the same as Google Ads, with YouTube-specific configurations

// Exchange authorization code for access token (same as Google)
exports.exchangeCodeForTokens = googleService.exchangeCodeForTokens;

// Create a campaign on YouTube (via Google Ads)
exports.createCampaign = async (campaign, user) => {
    try {
        // Check if user has connected to Google
        if (!user.platformCredentials.google?.isConnected) {
            throw new Error("User not connected to Google/YouTube");
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

        // Create campaign specifically for YouTube
        const response = await googleAdsClient.customers.campaigns.create({
            parent: `customers/${customerId}`,
            campaign: {
                name: campaign.name,
                status: campaign.status === "ACTIVE" ? "ENABLED" : "PAUSED",
                advertisingChannelType: "VIDEO", // Always VIDEO for YouTube
                advertisingChannelSubType: "YOUTUBE_WATCH", // Specifically for YouTube
                campaignBudget: {
                    amountMicros: campaign.budget.daily * 1000000, // Convert to micros (millionths)
                    deliveryMethod: "STANDARD",
                },
                startDate: formatDateForGoogle(campaign.startDate),
                endDate: campaign.endDate
                    ? formatDateForGoogle(campaign.endDate)
                    : undefined,
            },
        });

        return response.resourceName.split("/").pop(); // Extract campaign ID
    } catch (error) {
        console.error("Error creating YouTube campaign:", error.message);
        throw new Error("Failed to create YouTube campaign");
    }
};

// Update a campaign on YouTube (via Google Ads)
exports.updateCampaign = googleService.updateCampaign;

// Delete a campaign on YouTube (via Google Ads)
exports.deleteCampaign = googleService.deleteCampaign;

// Get campaign metrics from YouTube (via Google Ads)
exports.getCampaignMetrics = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Google
        if (!user.platformCredentials.google?.isConnected) {
            throw new Error("User not connected to Google/YouTube");
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

        // Query campaign metrics with YouTube-specific metrics
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
          metrics.average_cpm,
          metrics.video_views,
          metrics.video_quartile_p25_rate,
          metrics.video_quartile_p50_rate,
          metrics.video_quartile_p75_rate,
          metrics.video_quartile_p100_rate
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
                videoViews: 0,
                videoCompletionRate: 0,
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
            videoViews: parseInt(metrics.videoViews || 0),
            videoCompletionRate: parseFloat(metrics.videoQuartileP100Rate || 0),
        };
    } catch (error) {
        console.error("Error getting YouTube campaign metrics:", error.message);
        throw new Error("Failed to get YouTube campaign metrics");
    }
};

// Get campaign leads from YouTube (via Google Ads)
exports.getCampaignLeads = googleService.getCampaignLeads;

// Helper function to format date for Google Ads API (YYYYMMDD)
function formatDateForGoogle(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}${month}${day}`;
}
