const axios = require("axios");

// Facebook Graph API base URL
const FB_API_URL = "https://graph.facebook.com/v18.0";

// Exchange authorization code for access token
exports.exchangeCodeForTokens = async (code, redirectUri) => {
    try {
        const response = await axios.get(`${FB_API_URL}/oauth/access_token`, {
            params: {
                client_id: process.env.FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                code,
                redirect_uri: redirectUri,
            },
        });

        const { access_token, expires_in } = response.data;

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

        return {
            accessToken: access_token,
            refreshToken: null, // Facebook doesn't use refresh tokens in the same way
            expiresAt,
        };
    } catch (error) {
        // Log detailed error information
        console.error("Error exchanging code for Facebook tokens:");

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);

            // Provide more specific error message based on the response
            if (error.response.data && error.response.data.error) {
                const fbError = error.response.data.error;
                throw new Error(`Facebook API error: ${fbError.message || fbError.type || JSON.stringify(fbError)}`);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            throw new Error("Failed to receive response from Facebook API");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
            throw new Error(`Failed to exchange code for Facebook tokens: ${error.message}`);
        }

        // Default error if none of the above conditions are met
        throw new Error("Failed to exchange code for Facebook tokens");
    }
};

// Create a campaign on Facebook
exports.createCampaign = async (campaign, user) => {
    try {
        // Check if user has connected to Facebook
        if (!user.platformCredentials.facebook?.isConnected) {
            throw new Error("User not connected to Facebook");
        }

        const accessToken = user.platformCredentials.facebook.accessToken;

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(
            `${FB_API_URL}/me/adaccounts`,
            {
                params: {
                    access_token: accessToken,
                    fields: "id,name",
                },
            }
        );

        if (
            !adAccountsResponse.data.data ||
            adAccountsResponse.data.data.length === 0
        ) {
            throw new Error("No ad accounts found for this user");
        }

        // Use the first ad account
        const adAccountId = adAccountsResponse.data.data[0].id;

        // Create campaign
        const campaignResponse = await axios.post(
            `${FB_API_URL}/${adAccountId}/campaigns`,
            {
                name: campaign.name,
                objective: mapObjectiveToFacebook(campaign.objective),
                status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
                special_ad_categories: [],
            },
            {
                params: {
                    access_token: accessToken,
                },
            }
        );

        return campaignResponse.data.id;
    } catch (error) {
        console.error(
            "Error creating Facebook campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to create Facebook campaign");
    }
};

// Update a campaign on Facebook
exports.updateCampaign = async (platformCampaignId, campaign, user) => {
    try {
        // Check if user has connected to Facebook
        if (!user.platformCredentials.facebook?.isConnected) {
            throw new Error("User not connected to Facebook");
        }

        const accessToken = user.platformCredentials.facebook.accessToken;

        // Update campaign
        await axios.post(
            `${FB_API_URL}/${platformCampaignId}`,
            {
                name: campaign.name,
                status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
            },
            {
                params: {
                    access_token: accessToken,
                },
            }
        );

        return true;
    } catch (error) {
        console.error(
            "Error updating Facebook campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to update Facebook campaign");
    }
};

// Delete a campaign on Facebook
exports.deleteCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Facebook
        if (!user.platformCredentials.facebook?.isConnected) {
            throw new Error("User not connected to Facebook");
        }

        const accessToken = user.platformCredentials.facebook.accessToken;

        // Delete campaign (actually just sets status to DELETED)
        await axios.post(
            `${FB_API_URL}/${platformCampaignId}`,
            {
                status: "DELETED",
            },
            {
                params: {
                    access_token: accessToken,
                },
            }
        );

        return true;
    } catch (error) {
        console.error(
            "Error deleting Facebook campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to delete Facebook campaign");
    }
};

// Get campaign metrics from Facebook
exports.getCampaignMetrics = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Facebook
        if (!user.platformCredentials.facebook?.isConnected) {
            throw new Error("User not connected to Facebook");
        }

        const accessToken = user.platformCredentials.facebook.accessToken;

        // Get campaign insights
        const insightsResponse = await axios.get(
            `${FB_API_URL}/${platformCampaignId}/insights`,
            {
                params: {
                    access_token: accessToken,
                    fields: "impressions,clicks,spend,ctr,cpc,cpm",
                    date_preset: "lifetime",
                },
            }
        );

        if (
            !insightsResponse.data.data ||
            insightsResponse.data.data.length === 0
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

        const insights = insightsResponse.data.data[0];

        return {
            impressions: parseInt(insights.impressions || 0),
            clicks: parseInt(insights.clicks || 0),
            conversions: 0, // Need to set up conversion tracking separately
            spend: parseFloat(insights.spend || 0),
            ctr: parseFloat(insights.ctr || 0),
            cpc: parseFloat(insights.cpc || 0),
            cpm: parseFloat(insights.cpm || 0),
        };
    } catch (error) {
        console.error(
            "Error getting Facebook campaign metrics:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get Facebook campaign metrics");
    }
};

// Get campaign leads from Facebook
exports.getCampaignLeads = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Facebook
        if (!user.platformCredentials.facebook?.isConnected) {
            throw new Error("User not connected to Facebook");
        }

        const accessToken = user.platformCredentials.facebook.accessToken;

        // First, get the ad sets for this campaign
        const adSetsResponse = await axios.get(
            `${FB_API_URL}/${platformCampaignId}/adsets`,
            {
                params: {
                    access_token: accessToken,
                    fields: "id",
                },
            }
        );

        if (
            !adSetsResponse.data.data ||
            adSetsResponse.data.data.length === 0
        ) {
            return [];
        }

        // Get ads for each ad set
        let ads = [];
        for (const adSet of adSetsResponse.data.data) {
            const adsResponse = await axios.get(
                `${FB_API_URL}/${adSet.id}/ads`,
                {
                    params: {
                        access_token: accessToken,
                        fields: "id",
                    },
                }
            );

            if (adsResponse.data.data && adsResponse.data.data.length > 0) {
                ads = [...ads, ...adsResponse.data.data];
            }
        }

        if (ads.length === 0) {
            return [];
        }

        // Get lead forms for each ad
        let leads = [];
        for (const ad of ads) {
            // Get lead form IDs
            const leadFormResponse = await axios.get(
                `${FB_API_URL}/${ad.id}/leadgen_forms`,
                {
                    params: {
                        access_token: accessToken,
                    },
                }
            );

            if (
                !leadFormResponse.data.data ||
                leadFormResponse.data.data.length === 0
            ) {
                continue;
            }

            // Get leads for each form
            for (const form of leadFormResponse.data.data) {
                const leadsResponse = await axios.get(
                    `${FB_API_URL}/${form.id}/leads`,
                    {
                        params: {
                            access_token: accessToken,
                            fields: "field_data,created_time",
                        },
                    }
                );

                if (
                    leadsResponse.data.data &&
                    leadsResponse.data.data.length > 0
                ) {
                    // Process leads
                    for (const lead of leadsResponse.data.data) {
                        const leadData = {
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            adId: ad.id,
                            additionalInfo: new Map(),
                        };

                        // Extract lead field data
                        for (const field of lead.field_data) {
                            switch (field.name.toLowerCase()) {
                                case "first_name":
                                    leadData.firstName = field.values[0];
                                    break;
                                case "last_name":
                                    leadData.lastName = field.values[0];
                                    break;
                                case "email":
                                    leadData.email = field.values[0];
                                    break;
                                case "phone":
                                case "phone_number":
                                    leadData.phone = field.values[0];
                                    break;
                                default:
                                    leadData.additionalInfo.set(
                                        field.name,
                                        field.values[0]
                                    );
                            }
                        }

                        // Only add leads with email
                        if (leadData.email) {
                            leads.push(leadData);
                        }
                    }
                }
            }
        }

        return leads;
    } catch (error) {
        console.error(
            "Error getting Facebook campaign leads:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get Facebook campaign leads");
    }
};

// Helper function to map our objectives to Facebook's objectives
function mapObjectiveToFacebook(objective) {
    const mapping = {
        BRAND_AWARENESS: "BRAND_AWARENESS",
        REACH: "REACH",
        TRAFFIC: "TRAFFIC",
        ENGAGEMENT: "ENGAGEMENT",
        APP_INSTALLS: "APP_INSTALLS",
        VIDEO_VIEWS: "VIDEO_VIEWS",
        LEAD_GENERATION: "LEAD_GENERATION",
        CONVERSIONS: "CONVERSIONS",
        CATALOG_SALES: "CATALOG_SALES",
        STORE_TRAFFIC: "STORE_TRAFFIC",
    };

    return mapping[objective] || "REACH";
}
