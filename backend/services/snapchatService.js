const axios = require("axios");

// Snapchat API base URL
const SNAPCHAT_API_URL = "https://adsapi.snapchat.com/v1";

// Exchange authorization code for access token
exports.exchangeCodeForTokens = async (code, redirectUri) => {
    try {
        const response = await axios.post(
            "https://accounts.snapchat.com/login/oauth2/access_token",
            null,
            {
                params: {
                    client_id: process.env.SNAPCHAT_CLIENT_ID,
                    client_secret: process.env.SNAPCHAT_CLIENT_SECRET,
                    code,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code",
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token, refresh_token, expires_in } = response.data;

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

        return {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt,
        };
    } catch (error) {
        console.error(
            "Error exchanging code for Snapchat tokens:",
            error.response?.data || error.message
        );
        throw new Error("Failed to exchange code for Snapchat tokens");
    }
};

// Create a campaign on Snapchat
exports.createCampaign = async (campaign, user) => {
    try {
        // Check if user has connected to Snapchat
        if (!user.platformCredentials.snapchat?.isConnected) {
            throw new Error("User not connected to Snapchat");
        }

        const accessToken = user.platformCredentials.snapchat.accessToken;

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(
            `${SNAPCHAT_API_URL}/me/organizations`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (
            !adAccountsResponse.data.organizations ||
            adAccountsResponse.data.organizations.length === 0
        ) {
            throw new Error("No organizations found for this user");
        }

        // Use the first organization
        const organizationId = adAccountsResponse.data.organizations[0].id;

        // Get ad accounts for the organization
        const adAccountsListResponse = await axios.get(
            `${SNAPCHAT_API_URL}/organizations/${organizationId}/adaccounts`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (
            !adAccountsListResponse.data.adaccounts ||
            adAccountsListResponse.data.adaccounts.length === 0
        ) {
            throw new Error("No ad accounts found for this organization");
        }

        // Use the first ad account
        const adAccountId = adAccountsListResponse.data.adaccounts[0].id;

        // Create campaign
        const campaignResponse = await axios.post(
            `${SNAPCHAT_API_URL}/adaccounts/${adAccountId}/campaigns`,
            {
                campaign: {
                    name: campaign.name,
                    status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
                    objective: mapObjectiveToSnapchat(campaign.objective),
                    start_time: new Date(campaign.startDate).toISOString(),
                    end_time: campaign.endDate
                        ? new Date(campaign.endDate).toISOString()
                        : null,
                    daily_budget_micro: campaign.budget.daily * 1000000, // Convert to micros
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return campaignResponse.data.campaign.id;
    } catch (error) {
        console.error(
            "Error creating Snapchat campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to create Snapchat campaign");
    }
};

// Update a campaign on Snapchat
exports.updateCampaign = async (platformCampaignId, campaign, user) => {
    try {
        // Check if user has connected to Snapchat
        if (!user.platformCredentials.snapchat?.isConnected) {
            throw new Error("User not connected to Snapchat");
        }

        const accessToken = user.platformCredentials.snapchat.accessToken;

        // Update campaign
        await axios.put(
            `${SNAPCHAT_API_URL}/campaigns/${platformCampaignId}`,
            {
                campaign: {
                    name: campaign.name,
                    status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
                    end_time: campaign.endDate
                        ? new Date(campaign.endDate).toISOString()
                        : null,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return true;
    } catch (error) {
        console.error(
            "Error updating Snapchat campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to update Snapchat campaign");
    }
};

// Delete a campaign on Snapchat
exports.deleteCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Snapchat
        if (!user.platformCredentials.snapchat?.isConnected) {
            throw new Error("User not connected to Snapchat");
        }

        const accessToken = user.platformCredentials.snapchat.accessToken;

        // Delete campaign (set status to ARCHIVED)
        await axios.put(
            `${SNAPCHAT_API_URL}/campaigns/${platformCampaignId}`,
            {
                campaign: {
                    status: "ARCHIVED",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return true;
    } catch (error) {
        console.error(
            "Error deleting Snapchat campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to delete Snapchat campaign");
    }
};

// Launch a campaign on Snapchat (change status to ACTIVE and verify campaign is ready)
exports.launchCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Snapchat
        if (!user.platformCredentials.snapchat?.isConnected) {
            throw new Error("User not connected to Snapchat");
        }

        const accessToken = user.platformCredentials.snapchat.accessToken;

        // First, check if the campaign exists and get its details
        const campaignResponse = await axios.get(
            `${SNAPCHAT_API_URL}/campaigns/${platformCampaignId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!campaignResponse.data.campaign) {
            throw new Error(`Campaign with ID ${platformCampaignId} not found`);
        }

        // Check if campaign has ad squads (ad groups)
        const adSquadsResponse = await axios.get(
            `${SNAPCHAT_API_URL}/campaigns/${platformCampaignId}/adsquads`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (
            !adSquadsResponse.data.adsquads ||
            adSquadsResponse.data.adsquads.length === 0
        ) {
            throw new Error("Campaign does not have any ad squads (ad groups)");
        }

        // Check if ad squads have ads
        let hasAds = false;
        for (const adSquad of adSquadsResponse.data.adsquads) {
            const adsResponse = await axios.get(
                `${SNAPCHAT_API_URL}/adsquads/${adSquad.id}/ads`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (adsResponse.data.ads && adsResponse.data.ads.length > 0) {
                hasAds = true;
                break;
            }
        }

        if (!hasAds) {
            throw new Error("Campaign does not have any ads");
        }

        // Update campaign status to ACTIVE
        await axios.put(
            `${SNAPCHAT_API_URL}/campaigns/${platformCampaignId}`,
            {
                campaign: {
                    status: "ACTIVE",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Also activate all ad squads in the campaign
        for (const adSquad of adSquadsResponse.data.adsquads) {
            await axios.put(
                `${SNAPCHAT_API_URL}/adsquads/${adSquad.id}`,
                {
                    adsquad: {
                        status: "ACTIVE",
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        return true;
    } catch (error) {
        console.error(
            "Error launching Snapchat campaign:",
            error.response?.data || error.message
        );
        throw new Error(`Failed to launch Snapchat campaign: ${error.message}`);
    }
};

// Get campaign metrics from Snapchat
exports.getCampaignMetrics = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Snapchat
        if (!user.platformCredentials.snapchat?.isConnected) {
            throw new Error("User not connected to Snapchat");
        }

        const accessToken = user.platformCredentials.snapchat.accessToken;

        // Get campaign stats
        const statsResponse = await axios.get(
            `${SNAPCHAT_API_URL}/campaigns/${platformCampaignId}/stats`,
            {
                params: {
                    fields: "impressions,swipes,spend,swipe_rate,ecpm,ecpc",
                    start_time: new Date(
                        new Date().setDate(new Date().getDate() - 30)
                    ).toISOString(),
                    end_time: new Date().toISOString(),
                    granularity: "TOTAL",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (
            !statsResponse.data.timeseries_stats ||
            statsResponse.data.timeseries_stats.length === 0
        ) {
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

        const stats = statsResponse.data.timeseries_stats[0];

        return {
            impressions: parseInt(stats.impressions || 0),
            clicks: parseInt(stats.swipes || 0), // Snapchat calls clicks "swipes"
            conversions: 0, // Snapchat doesn't provide this directly
            spend: parseFloat(stats.spend || 0),
            ctr: parseFloat(stats.swipe_rate || 0),
            cpc: parseFloat(stats.ecpc || 0),
            cpm: parseFloat(stats.ecpm || 0),
        };
    } catch (error) {
        console.error(
            "Error getting Snapchat campaign metrics:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get Snapchat campaign metrics");
    }
};

// Get campaign leads from Snapchat
exports.getCampaignLeads = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Snapchat
        if (!user.platformCredentials.snapchat?.isConnected) {
            throw new Error("User not connected to Snapchat");
        }

        const accessToken = user.platformCredentials.snapchat.accessToken;

        // Get ad squads for the campaign
        const adSquadsResponse = await axios.get(
            `${SNAPCHAT_API_URL}/campaigns/${platformCampaignId}/adsquads`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (
            !adSquadsResponse.data.adsquads ||
            adSquadsResponse.data.adsquads.length === 0
        ) {
            return [];
        }

        // Get ads for each ad squad
        let ads = [];
        for (const adSquad of adSquadsResponse.data.adsquads) {
            const adsResponse = await axios.get(
                `${SNAPCHAT_API_URL}/adsquads/${adSquad.id}/ads`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (adsResponse.data.ads && adsResponse.data.ads.length > 0) {
                ads = [...ads, ...adsResponse.data.ads];
            }
        }

        if (ads.length === 0) {
            return [];
        }

        // Get leads for each ad
        let leads = [];
        for (const ad of ads) {
            // Snapchat doesn't have a direct API for lead retrieval
            // In a real implementation, you would need to set up a webhook or
            // use a third-party service to capture leads from Snapchat
            // This is a placeholder for demonstration purposes
            // In reality, you would need to implement a custom solution
        }

        return leads;
    } catch (error) {
        console.error(
            "Error getting Snapchat campaign leads:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get Snapchat campaign leads");
    }
};

// Helper function to map our objectives to Snapchat's objectives
function mapObjectiveToSnapchat(objective) {
    const mapping = {
        BRAND_AWARENESS: "AWARENESS",
        REACH: "AWARENESS",
        TRAFFIC: "TRAFFIC",
        ENGAGEMENT: "AWARENESS",
        APP_INSTALLS: "APP_INSTALLS",
        VIDEO_VIEWS: "VIDEO_VIEWS",
        LEAD_GENERATION: "LEAD_GENERATION",
        CONVERSIONS: "CONVERSIONS",
        CATALOG_SALES: "CATALOG_SALES",
        STORE_TRAFFIC: "TRAFFIC",
    };

    return mapping[objective] || "AWARENESS";
}
