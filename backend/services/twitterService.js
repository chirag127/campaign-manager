const axios = require("axios");
const crypto = require("crypto");
const OAuth = require("oauth-1.0a");

// Twitter API base URL
const TWITTER_API_URL = "https://api.twitter.com/2";
const TWITTER_ADS_API_URL = "https://ads-api.twitter.com/12";

// Exchange authorization code for access token
exports.exchangeCodeForTokens = async (code, redirectUri) => {
    try {
        const response = await axios.post(
            "https://api.twitter.com/oauth2/token",
            null,
            {
                params: {
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                    client_id: process.env.TWITTER_API_KEY,
                    code_verifier: "challenge", // This should be stored from the initial auth request
                },
                auth: {
                    username: process.env.TWITTER_API_KEY,
                    password: process.env.TWITTER_API_SECRET,
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token, refresh_token } = response.data;

        return {
            accessToken: access_token,
            accessTokenSecret: refresh_token, // Twitter uses refresh token as the "secret"
            expiresAt: null, // Twitter tokens don't expire
        };
    } catch (error) {
        console.error(
            "Error exchanging code for Twitter tokens:",
            error.response?.data || error.message
        );
        throw new Error("Failed to exchange code for Twitter tokens");
    }
};

// Create a campaign on Twitter
exports.createCampaign = async (campaign, user) => {
    try {
        // Check if user has connected to Twitter
        if (!user.platformCredentials.twitter?.isConnected) {
            throw new Error("User not connected to Twitter");
        }

        const accessToken = user.platformCredentials.twitter.accessToken;
        const accessTokenSecret =
            user.platformCredentials.twitter.accessTokenSecret;

        // Create OAuth 1.0a instance
        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_API_KEY,
                secret: process.env.TWITTER_API_SECRET,
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha1", key)
                    .update(base_string)
                    .digest("base64");
            },
        });

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts`,
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
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
            `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns`,
            {
                name: campaign.name,
                objective: mapObjectiveToTwitter(campaign.objective),
                daily_budget_amount_local_micro:
                    campaign.budget.daily * 1000000, // Convert to micros
                start_time: new Date(campaign.startDate).toISOString(),
                end_time: campaign.endDate
                    ? new Date(campaign.endDate).toISOString()
                    : null,
                standard_delivery: true,
                frequency_cap: 2,
                duration_in_days: 30,
            },
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns`,
                                method: "POST",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        return campaignResponse.data.data.id;
    } catch (error) {
        console.error(
            "Error creating Twitter campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to create Twitter campaign");
    }
};

// Update a campaign on Twitter
exports.updateCampaign = async (platformCampaignId, campaign, user) => {
    try {
        // Check if user has connected to Twitter
        if (!user.platformCredentials.twitter?.isConnected) {
            throw new Error("User not connected to Twitter");
        }

        const accessToken = user.platformCredentials.twitter.accessToken;
        const accessTokenSecret =
            user.platformCredentials.twitter.accessTokenSecret;

        // Create OAuth 1.0a instance
        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_API_KEY,
                secret: process.env.TWITTER_API_SECRET,
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha1", key)
                    .update(base_string)
                    .digest("base64");
            },
        });

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts`,
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
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

        // Update campaign
        await axios.put(
            `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns/${platformCampaignId}`,
            {
                name: campaign.name,
                end_time: campaign.endDate
                    ? new Date(campaign.endDate).toISOString()
                    : null,
                entity_status:
                    campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
            },
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns/${platformCampaignId}`,
                                method: "PUT",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        return true;
    } catch (error) {
        console.error(
            "Error updating Twitter campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to update Twitter campaign");
    }
};

// Delete a campaign on Twitter
exports.deleteCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Twitter
        if (!user.platformCredentials.twitter?.isConnected) {
            throw new Error("User not connected to Twitter");
        }

        const accessToken = user.platformCredentials.twitter.accessToken;
        const accessTokenSecret =
            user.platformCredentials.twitter.accessTokenSecret;

        // Create OAuth 1.0a instance
        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_API_KEY,
                secret: process.env.TWITTER_API_SECRET,
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha1", key)
                    .update(base_string)
                    .digest("base64");
            },
        });

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts`,
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
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

        // Delete campaign (set status to DELETED)
        await axios.put(
            `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns/${platformCampaignId}`,
            {
                entity_status: "DELETED",
            },
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns/${platformCampaignId}`,
                                method: "PUT",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        return true;
    } catch (error) {
        console.error(
            "Error deleting Twitter campaign:",
            error.response?.data || error.message
        );
        throw new Error("Failed to delete Twitter campaign");
    }
};

// Launch a campaign on Twitter (change status to ACTIVE and verify campaign is ready)
exports.launchCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Twitter
        if (!user.platformCredentials.twitter?.isConnected) {
            throw new Error("User not connected to Twitter");
        }

        const accessToken = user.platformCredentials.twitter.accessToken;
        const accessTokenSecret =
            user.platformCredentials.twitter.accessTokenSecret;

        // Create OAuth 1.0a instance
        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_API_KEY,
                secret: process.env.TWITTER_API_SECRET,
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha1", key)
                    .update(base_string)
                    .digest("base64");
            },
        });

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts`,
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
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

        // First, check if the campaign exists and get its details
        const campaignResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns/${platformCampaignId}`,
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns/${platformCampaignId}`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        if (!campaignResponse.data.data) {
            throw new Error(`Campaign with ID ${platformCampaignId} not found`);
        }

        // Check if campaign has line items (ad groups)
        const lineItemsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/line_items`,
            {
                params: {
                    campaign_ids: platformCampaignId,
                },
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/line_items`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        if (
            !lineItemsResponse.data.data ||
            lineItemsResponse.data.data.length === 0
        ) {
            throw new Error(
                "Campaign does not have any line items (ad groups)"
            );
        }

        // Check if campaign has promoted tweets (ads)
        const promotedTweetsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/promoted_tweets`,
            {
                params: {
                    line_item_ids: lineItemsResponse.data.data
                        .map((item) => item.id)
                        .join(","),
                },
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/promoted_tweets`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        if (
            !promotedTweetsResponse.data.data ||
            promotedTweetsResponse.data.data.length === 0
        ) {
            throw new Error("Campaign does not have any promoted tweets (ads)");
        }

        // Update campaign status to ACTIVE
        await axios.put(
            `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns/${platformCampaignId}`,
            {
                entity_status: "ACTIVE",
            },
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/campaigns/${platformCampaignId}`,
                                method: "PUT",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        // Also activate all line items (ad groups) in the campaign
        for (const lineItem of lineItemsResponse.data.data) {
            await axios.put(
                `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/line_items/${lineItem.id}`,
                {
                    entity_status: "ACTIVE",
                },
                {
                    headers: {
                        ...oauth.toHeader(
                            oauth.authorize(
                                {
                                    url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/line_items/${lineItem.id}`,
                                    method: "PUT",
                                },
                                {
                                    key: accessToken,
                                    secret: accessTokenSecret,
                                }
                            )
                        ),
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        return true;
    } catch (error) {
        console.error(
            "Error launching Twitter campaign:",
            error.response?.data || error.message
        );
        throw new Error(`Failed to launch Twitter campaign: ${error.message}`);
    }
};

// Get campaign metrics from Twitter
exports.getCampaignMetrics = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Twitter
        if (!user.platformCredentials.twitter?.isConnected) {
            throw new Error("User not connected to Twitter");
        }

        const accessToken = user.platformCredentials.twitter.accessToken;
        const accessTokenSecret =
            user.platformCredentials.twitter.accessTokenSecret;

        // Create OAuth 1.0a instance
        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_API_KEY,
                secret: process.env.TWITTER_API_SECRET,
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha1", key)
                    .update(base_string)
                    .digest("base64");
            },
        });

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts`,
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
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

        // Get campaign analytics
        const analyticsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/stats/accounts/${adAccountId}`,
            {
                params: {
                    entity: "CAMPAIGN",
                    entity_ids: platformCampaignId,
                    metric_groups: "ENGAGEMENT,BILLING",
                    start_time: new Date(
                        new Date().setDate(new Date().getDate() - 30)
                    ).toISOString(),
                    end_time: new Date().toISOString(),
                    granularity: "TOTAL",
                },
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/stats/accounts/${adAccountId}`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        if (
            !analyticsResponse.data.data ||
            analyticsResponse.data.data.length === 0
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

        const metrics = analyticsResponse.data.data[0].id_data[0].metrics;

        // Calculate derived metrics
        const impressions = metrics.impressions || 0;
        const clicks = metrics.clicks || 0;
        const spend = (metrics.billed_charge_local_micro || 0) / 1000000; // Convert from micros

        return {
            impressions,
            clicks,
            conversions: metrics.conversions || 0,
            spend,
            ctr: impressions > 0 ? clicks / impressions : 0,
            cpc: clicks > 0 ? spend / clicks : 0,
            cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
        };
    } catch (error) {
        console.error(
            "Error getting Twitter campaign metrics:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get Twitter campaign metrics");
    }
};

// Get campaign leads from Twitter
exports.getCampaignLeads = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Twitter
        if (!user.platformCredentials.twitter?.isConnected) {
            throw new Error("User not connected to Twitter");
        }

        const accessToken = user.platformCredentials.twitter.accessToken;
        const accessTokenSecret =
            user.platformCredentials.twitter.accessTokenSecret;

        // Create OAuth 1.0a instance
        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_API_KEY,
                secret: process.env.TWITTER_API_SECRET,
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha1", key)
                    .update(base_string)
                    .digest("base64");
            },
        });

        // Get user's ad accounts
        const adAccountsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts`,
            {
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
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

        // Get cards for the campaign
        const cardsResponse = await axios.get(
            `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/cards/website`,
            {
                params: {
                    campaign_ids: platformCampaignId,
                },
                headers: {
                    ...oauth.toHeader(
                        oauth.authorize(
                            {
                                url: `${TWITTER_ADS_API_URL}/accounts/${adAccountId}/cards/website`,
                                method: "GET",
                            },
                            {
                                key: accessToken,
                                secret: accessTokenSecret,
                            }
                        )
                    ),
                    "Content-Type": "application/json",
                },
            }
        );

        if (!cardsResponse.data.data || cardsResponse.data.data.length === 0) {
            return [];
        }

        // Get leads for each card
        let leads = [];
        for (const card of cardsResponse.data.data) {
            // Twitter doesn't have a direct API for lead retrieval
            // In a real implementation, you would need to set up a webhook or
            // use a third-party service to capture leads from Twitter
            // This is a placeholder for demonstration purposes
            // In reality, you would need to implement a custom solution
        }

        return leads;
    } catch (error) {
        console.error(
            "Error getting Twitter campaign leads:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get Twitter campaign leads");
    }
};

// Helper function to map our objectives to Twitter's objectives
function mapObjectiveToTwitter(objective) {
    const mapping = {
        BRAND_AWARENESS: "AWARENESS",
        REACH: "REACH",
        TRAFFIC: "WEBSITE_CLICKS",
        ENGAGEMENT: "ENGAGEMENTS",
        APP_INSTALLS: "APP_INSTALLS",
        VIDEO_VIEWS: "VIDEO_VIEWS",
        LEAD_GENERATION: "LEAD_GENERATION",
        CONVERSIONS: "WEBSITE_CONVERSIONS",
        CATALOG_SALES: "WEBSITE_CONVERSIONS",
        STORE_TRAFFIC: "WEBSITE_CONVERSIONS",
    };

    return mapping[objective] || "AWARENESS";
}
