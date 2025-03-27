const axios = require("axios");

// LinkedIn API base URLs
const LI_API_URL = "https://api.linkedin.com/v2";
const LI_MARKETING_API_URL = "https://api.linkedin.com/v2/adAccountsV2";

// Exchange authorization code for access token
exports.exchangeCodeForTokens = async (code, redirectUri) => {
    try {
        const response = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            null,
            {
                params: {
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                    client_id: process.env.LINKEDIN_CLIENT_ID,
                    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
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
            "Error exchanging code for LinkedIn tokens:",
            error.response?.data || error.message
        );
        throw new Error("Failed to exchange code for LinkedIn tokens");
    }
};

// Create a campaign on LinkedIn
exports.createCampaign = async (campaign, user) => {
    try {
        // Check if user has connected to LinkedIn
        if (!user.platformCredentials.linkedin?.isConnected) {
            throw new Error("User not connected to LinkedIn");
        }

        const accessToken = user.platformCredentials.linkedin.accessToken;

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(`${LI_MARKETING_API_URL}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
            },
        });

        if (
            !adAccountsResponse.data.elements ||
            adAccountsResponse.data.elements.length === 0
        ) {
            throw new Error("No ad accounts found for this user");
        }

        // Use the first ad account
        const adAccountId = adAccountsResponse.data.elements[0].id;

        // Create campaign
        const campaignResponse = await axios.post(
            `${LI_MARKETING_API_URL}/${adAccountId}/campaigns`,
            {
                account: `urn:li:sponsoredAccount:${adAccountId}`,
                name: campaign.name,
                objective: mapObjectiveToLinkedIn(campaign.objective),
                status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
                type: "SPONSORED_UPDATES",
                costType: "CPC",
                unitCost: {
                    amount: campaign.budget.daily * 100, // Convert to cents
                    currencyCode: campaign.budget.currency,
                },
                dailyBudget: {
                    amount: campaign.budget.daily * 100, // Convert to cents
                    currencyCode: campaign.budget.currency,
                },
                startDate: {
                    year: new Date(campaign.startDate).getFullYear(),
                    month: new Date(campaign.startDate).getMonth() + 1,
                    day: new Date(campaign.startDate).getDate(),
                },
                endDate: campaign.endDate
                    ? {
                          year: new Date(campaign.endDate).getFullYear(),
                          month: new Date(campaign.endDate).getMonth() + 1,
                          day: new Date(campaign.endDate).getDate(),
                      }
                    : null,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                    "Content-Type": "application/json",
                },
            }
        );

        return campaignResponse.data.id;
    } catch (error) {
        console.error(
            "Error creating LinkedIn campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to create LinkedIn campaign");
    }
};

// Update a campaign on LinkedIn
exports.updateCampaign = async (platformCampaignId, campaign, user) => {
    try {
        // Check if user has connected to LinkedIn
        if (!user.platformCredentials.linkedin?.isConnected) {
            throw new Error("User not connected to LinkedIn");
        }

        const accessToken = user.platformCredentials.linkedin.accessToken;

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(`${LI_MARKETING_API_URL}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
            },
        });

        if (
            !adAccountsResponse.data.elements ||
            adAccountsResponse.data.elements.length === 0
        ) {
            throw new Error("No ad accounts found for this user");
        }

        // Use the first ad account
        const adAccountId = adAccountsResponse.data.elements[0].id;

        // Update campaign
        await axios.post(
            `${LI_MARKETING_API_URL}/${adAccountId}/campaigns/${platformCampaignId}`,
            {
                patch: {
                    $set: {
                        name: campaign.name,
                        status:
                            campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
                        endDate: campaign.endDate
                            ? {
                                  year: new Date(
                                      campaign.endDate
                                  ).getFullYear(),
                                  month:
                                      new Date(campaign.endDate).getMonth() + 1,
                                  day: new Date(campaign.endDate).getDate(),
                              }
                            : null,
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                    "Content-Type": "application/json",
                },
            }
        );

        return true;
    } catch (error) {
        console.error(
            "Error updating LinkedIn campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to update LinkedIn campaign");
    }
};

// Delete a campaign on LinkedIn
exports.deleteCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to LinkedIn
        if (!user.platformCredentials.linkedin?.isConnected) {
            throw new Error("User not connected to LinkedIn");
        }

        const accessToken = user.platformCredentials.linkedin.accessToken;

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(`${LI_MARKETING_API_URL}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
            },
        });

        if (
            !adAccountsResponse.data.elements ||
            adAccountsResponse.data.elements.length === 0
        ) {
            throw new Error("No ad accounts found for this user");
        }

        // Use the first ad account
        const adAccountId = adAccountsResponse.data.elements[0].id;

        // Delete campaign (set status to ARCHIVED)
        await axios.post(
            `${LI_MARKETING_API_URL}/${adAccountId}/campaigns/${platformCampaignId}`,
            {
                patch: {
                    $set: {
                        status: "ARCHIVED",
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                    "Content-Type": "application/json",
                },
            }
        );

        return true;
    } catch (error) {
        console.error(
            "Error deleting LinkedIn campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to delete LinkedIn campaign");
    }
};

// Get campaign metrics from LinkedIn
exports.getCampaignMetrics = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to LinkedIn
        if (!user.platformCredentials.linkedin?.isConnected) {
            throw new Error("User not connected to LinkedIn");
        }

        const accessToken = user.platformCredentials.linkedin.accessToken;

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(`${LI_MARKETING_API_URL}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
            },
        });

        if (
            !adAccountsResponse.data.elements ||
            adAccountsResponse.data.elements.length === 0
        ) {
            throw new Error("No ad accounts found for this user");
        }

        // Use the first ad account
        const adAccountId = adAccountsResponse.data.elements[0].id;

        // Get campaign analytics
        const analyticsResponse = await axios.get(
            `${LI_MARKETING_API_URL}/${adAccountId}/analytics`,
            {
                params: {
                    q: "analytics",
                    dateRange: {
                        start: {
                            year: new Date().getFullYear() - 1,
                            month: new Date().getMonth() + 1,
                            day: new Date().getDate(),
                        },
                        end: {
                            year: new Date().getFullYear(),
                            month: new Date().getMonth() + 1,
                            day: new Date().getDate(),
                        },
                    },
                    campaigns: [
                        `urn:li:sponsoredCampaign:${platformCampaignId}`,
                    ],
                    fields: "impressions,clicks,conversions,costInUsd,clickThroughRate,averageCpc,averageCpm",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            }
        );

        if (
            !analyticsResponse.data.elements ||
            analyticsResponse.data.elements.length === 0
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

        const metrics = analyticsResponse.data.elements[0];

        return {
            impressions: parseInt(metrics.impressions || 0),
            clicks: parseInt(metrics.clicks || 0),
            conversions: parseInt(metrics.conversions || 0),
            spend: parseFloat(metrics.costInUsd || 0),
            ctr: parseFloat(metrics.clickThroughRate || 0),
            cpc: parseFloat(metrics.averageCpc || 0),
            cpm: parseFloat(metrics.averageCpm || 0),
        };
    } catch (error) {
        console.error(
            "Error getting LinkedIn campaign metrics:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get LinkedIn campaign metrics");
    }
};

// Launch a campaign on LinkedIn (change status to ACTIVE and verify campaign is ready)
exports.launchCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to LinkedIn
        if (!user.platformCredentials.linkedin?.isConnected) {
            throw new Error("User not connected to LinkedIn");
        }

        const accessToken = user.platformCredentials.linkedin.accessToken;

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(`${LI_MARKETING_API_URL}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
            },
        });

        if (
            !adAccountsResponse.data.elements ||
            adAccountsResponse.data.elements.length === 0
        ) {
            throw new Error("No ad accounts found for this user");
        }

        // Use the first ad account
        const adAccountId = adAccountsResponse.data.elements[0].id;

        // First, check if the campaign exists and get its details
        const campaignResponse = await axios.get(
            `${LI_MARKETING_API_URL}/${adAccountId}/campaigns/${platformCampaignId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            }
        );

        if (!campaignResponse.data) {
            throw new Error(`Campaign with ID ${platformCampaignId} not found`);
        }

        // Check if campaign has creatives/ads
        const creativesResponse = await axios.get(
            `${LI_MARKETING_API_URL}/${adAccountId}/creatives`,
            {
                params: {
                    q: "search",
                    search: {
                        campaigns: [
                            `urn:li:sponsoredCampaign:${platformCampaignId}`,
                        ],
                    },
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            }
        );

        if (
            !creativesResponse.data.elements ||
            creativesResponse.data.elements.length === 0
        ) {
            throw new Error("Campaign does not have any creatives or ads");
        }

        // Update campaign status to ACTIVE
        await axios.post(
            `${LI_MARKETING_API_URL}/${adAccountId}/campaigns/${platformCampaignId}`,
            {
                patch: {
                    $set: {
                        status: "ACTIVE",
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                    "Content-Type": "application/json",
                },
            }
        );

        // Also activate all creatives associated with this campaign
        for (const creative of creativesResponse.data.elements) {
            await axios.post(
                `${LI_MARKETING_API_URL}/${adAccountId}/creatives/${creative.id}`,
                {
                    patch: {
                        $set: {
                            status: "ACTIVE",
                        },
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "X-Restli-Protocol-Version": "2.0.0",
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        return true;
    } catch (error) {
        console.error(
            "Error launching LinkedIn campaign:",
            error.response?.data || error.message
        );
        throw new Error(`Failed to launch LinkedIn campaign: ${error.message}`);
    }
};

// Get campaign leads from LinkedIn
exports.getCampaignLeads = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to LinkedIn
        if (!user.platformCredentials.linkedin?.isConnected) {
            throw new Error("User not connected to LinkedIn");
        }

        const accessToken = user.platformCredentials.linkedin.accessToken;

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(`${LI_MARKETING_API_URL}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
            },
        });

        if (
            !adAccountsResponse.data.elements ||
            adAccountsResponse.data.elements.length === 0
        ) {
            throw new Error("No ad accounts found for this user");
        }

        // Use the first ad account
        const adAccountId = adAccountsResponse.data.elements[0].id;

        // Get lead gen forms for the campaign
        const formsResponse = await axios.get(
            `${LI_MARKETING_API_URL}/${adAccountId}/adLeadGenForms`,
            {
                params: {
                    q: "search",
                    search: {
                        campaigns: [
                            `urn:li:sponsoredCampaign:${platformCampaignId}`,
                        ],
                    },
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            }
        );

        if (
            !formsResponse.data.elements ||
            formsResponse.data.elements.length === 0
        ) {
            return [];
        }

        // Get leads for each form
        let leads = [];
        for (const form of formsResponse.data.elements) {
            const leadsResponse = await axios.get(
                `${LI_MARKETING_API_URL}/${adAccountId}/adLeadGenForms/${form.id}/submissions`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "X-Restli-Protocol-Version": "2.0.0",
                    },
                }
            );

            if (
                leadsResponse.data.elements &&
                leadsResponse.data.elements.length > 0
            ) {
                // Process leads
                for (const lead of leadsResponse.data.elements) {
                    const leadData = {
                        firstName: lead.firstName || "",
                        lastName: lead.lastName || "",
                        email: lead.email || "",
                        phone: lead.phoneNumber || "",
                        adId: lead.creativeId,
                        additionalInfo: new Map(),
                    };

                    // Add custom fields
                    if (lead.customFieldValues) {
                        for (const field of lead.customFieldValues) {
                            leadData.additionalInfo.set(
                                field.name,
                                field.value
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

        return leads;
    } catch (error) {
        console.error(
            "Error getting LinkedIn campaign leads:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get LinkedIn campaign leads");
    }
};

// Helper function to map our objectives to LinkedIn's objectives
function mapObjectiveToLinkedIn(objective) {
    const mapping = {
        BRAND_AWARENESS: "BRAND_AWARENESS",
        REACH: "BRAND_AWARENESS",
        TRAFFIC: "WEBSITE_VISITS",
        ENGAGEMENT: "ENGAGEMENT",
        APP_INSTALLS: "APP_INSTALLS",
        VIDEO_VIEWS: "VIDEO_VIEWS",
        LEAD_GENERATION: "LEAD_GENERATION",
        CONVERSIONS: "WEBSITE_CONVERSIONS",
        CATALOG_SALES: "WEBSITE_CONVERSIONS",
        STORE_TRAFFIC: "WEBSITE_CONVERSIONS",
    };

    return mapping[objective] || "BRAND_AWARENESS";
}
