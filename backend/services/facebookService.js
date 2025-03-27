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
                throw new Error(
                    `Facebook API error: ${
                        fbError.message ||
                        fbError.type ||
                        JSON.stringify(fbError)
                    }`
                );
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            throw new Error("Failed to receive response from Facebook API");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
            throw new Error(
                `Failed to exchange code for Facebook tokens: ${error.message}`
            );
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

        const campaignId = campaignResponse.data.id;

        // If campaign has target audience and creative assets, create ad sets and ads
        if (
            campaign.targetAudience &&
            campaign.creativeAssets &&
            campaign.creativeAssets.length > 0
        ) {
            try {
                // Create ad set
                const adSetId = await createAdSet(
                    campaign,
                    campaignId,
                    adAccountId,
                    accessToken
                );

                // Upload creative assets and create ads
                await createAdsWithCreatives(
                    campaign,
                    adSetId,
                    adAccountId,
                    accessToken
                );
            } catch (adSetError) {
                console.error(
                    "Error creating ad sets or ads:",
                    adSetError.message
                );
                // Continue with just the campaign created
            }
        }

        return campaignId;
    } catch (error) {
        console.error(
            "Error creating Facebook campaign:",
            error.response?.data || error.message
        );

        // Provide more specific error message
        if (error.response?.data?.error) {
            const fbError = error.response.data.error;
            throw new Error(
                `Failed to create Facebook campaign: ${
                    fbError.message || fbError.type || JSON.stringify(fbError)
                }`
            );
        }

        throw new Error(`Failed to create Facebook campaign: ${error.message}`);
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
    // Facebook has updated their objectives to use the new OUTCOME_* format
    const mapping = {
        BRAND_AWARENESS: "OUTCOME_AWARENESS",
        REACH: "OUTCOME_AWARENESS",
        TRAFFIC: "OUTCOME_TRAFFIC",
        ENGAGEMENT: "OUTCOME_ENGAGEMENT",
        APP_INSTALLS: "OUTCOME_APP_PROMOTION",
        VIDEO_VIEWS: "OUTCOME_AWARENESS",
        LEAD_GENERATION: "OUTCOME_LEADS",
        CONVERSIONS: "OUTCOME_SALES",
        CATALOG_SALES: "OUTCOME_SALES",
        STORE_TRAFFIC: "OUTCOME_TRAFFIC",
    };

    return mapping[objective] || "OUTCOME_AWARENESS";
}

// Create an ad set for the campaign
async function createAdSet(campaign, campaignId, adAccountId, accessToken) {
    try {
        // Prepare targeting parameters
        const targeting = {
            age_min: campaign.targetAudience?.ageRange?.min || 18,
            age_max: campaign.targetAudience?.ageRange?.max || 65,
        };

        // Add gender targeting if specified
        if (
            campaign.targetAudience?.genders &&
            campaign.targetAudience.genders.length > 0
        ) {
            // Facebook uses 1 for male, 2 for female
            const genderMapping = {
                MALE: [1],
                FEMALE: [2],
                ALL: [1, 2],
            };

            // Get the first gender in the array or default to ALL
            const gender = campaign.targetAudience.genders[0] || "ALL";
            targeting.genders = genderMapping[gender];
        }

        // Add location targeting if specified
        if (
            campaign.targetAudience?.locations &&
            campaign.targetAudience.locations.length > 0
        ) {
            targeting.geo_locations = {
                countries: campaign.targetAudience.locations,
            };
        } else {
            // Default to US if no locations specified
            targeting.geo_locations = {
                countries: ["US"],
            };
        }

        // Add interest targeting if specified
        if (
            campaign.targetAudience?.interests &&
            campaign.targetAudience.interests.length > 0
        ) {
            targeting.interests = campaign.targetAudience.interests.map(
                (interest) => ({
                    name: interest,
                    id: interest, // This is a simplification; in reality, you'd need to use Facebook's interest IDs
                })
            );
        }

        // Create the ad set
        const adSetResponse = await axios.post(
            `${FB_API_URL}/${adAccountId}/adsets`,
            {
                name: `${campaign.name} - Ad Set`,
                campaign_id: campaignId,
                daily_budget: campaign.budget.daily * 100, // Convert to cents
                bid_amount: 500, // $5.00 bid amount in cents
                billing_event: "IMPRESSIONS",
                optimization_goal: getOptimizationGoal(campaign.objective),
                targeting,
                status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
                start_time: new Date(campaign.startDate).toISOString(),
                end_time: campaign.endDate
                    ? new Date(campaign.endDate).toISOString()
                    : null,
            },
            {
                params: {
                    access_token: accessToken,
                },
            }
        );

        return adSetResponse.data.id;
    } catch (error) {
        console.error(
            "Error creating Facebook ad set:",
            error.response?.data || error.message
        );
        throw new Error("Failed to create Facebook ad set");
    }
}

// Create ads with creative assets
async function createAdsWithCreatives(
    campaign,
    adSetId,
    adAccountId,
    accessToken
) {
    try {
        // Process each creative asset
        for (const asset of campaign.creativeAssets) {
            // Skip if missing required fields
            if (!asset.url || !asset.title) continue;

            // Upload the image or video to Facebook
            let creativeId;
            if (asset.type === "IMAGE") {
                creativeId = await uploadImageAsset(
                    asset.url,
                    adAccountId,
                    accessToken
                );
            } else if (asset.type === "VIDEO") {
                creativeId = await uploadVideoAsset(
                    asset.url,
                    adAccountId,
                    accessToken
                );
            } else {
                // Skip unsupported asset types
                continue;
            }

            if (!creativeId) continue;

            // Create the ad creative
            const adCreativeResponse = await axios.post(
                `${FB_API_URL}/${adAccountId}/adcreatives`,
                {
                    name: asset.title,
                    object_story_spec: {
                        page_id: await getPageId(accessToken), // Get the user's Facebook Page ID
                        link_data: {
                            message: asset.description || "",
                            link: asset.url,
                            image_hash:
                                asset.type === "IMAGE" ? creativeId : null,
                            video_id:
                                asset.type === "VIDEO" ? creativeId : null,
                            call_to_action: {
                                type: mapCallToAction(asset.callToAction),
                            },
                        },
                    },
                },
                {
                    params: {
                        access_token: accessToken,
                    },
                }
            );

            // Create the ad
            await axios.post(
                `${FB_API_URL}/${adAccountId}/ads`,
                {
                    name: `${campaign.name} - ${asset.title}`,
                    adset_id: adSetId,
                    creative: {
                        creative_id: adCreativeResponse.data.id,
                    },
                    status: campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
                },
                {
                    params: {
                        access_token: accessToken,
                    },
                }
            );
        }

        return true;
    } catch (error) {
        console.error(
            "Error creating Facebook ads:",
            error.response?.data || error.message
        );
        throw new Error("Failed to create Facebook ads");
    }
}

// Upload an image asset to Facebook
async function uploadImageAsset(imageUrl, adAccountId, accessToken) {
    try {
        // Facebook requires either a file upload or a URL to an image
        const response = await axios.post(
            `${FB_API_URL}/${adAccountId}/adimages`,
            {
                filename: imageUrl.split("/").pop(),
                url: imageUrl,
            },
            {
                params: {
                    access_token: accessToken,
                },
            }
        );

        // Return the image hash
        const images = response.data.images;
        const imageHash = images[Object.keys(images)[0]].hash;
        return imageHash;
    } catch (error) {
        console.error(
            "Error uploading image to Facebook:",
            error.response?.data || error.message
        );
        return null;
    }
}

// Upload a video asset to Facebook
async function uploadVideoAsset(videoUrl, adAccountId, accessToken) {
    try {
        // Facebook requires either a file upload or a URL to a video
        const response = await axios.post(
            `${FB_API_URL}/${adAccountId}/advideos`,
            {
                file_url: videoUrl,
                name: `Video ${Date.now()}`,
            },
            {
                params: {
                    access_token: accessToken,
                },
            }
        );

        // Return the video ID
        return response.data.id;
    } catch (error) {
        console.error(
            "Error uploading video to Facebook:",
            error.response?.data || error.message
        );
        return null;
    }
}

// Get the user's Facebook Page ID
async function getPageId(accessToken) {
    try {
        const response = await axios.get(`${FB_API_URL}/me/accounts`, {
            params: {
                access_token: accessToken,
                fields: "id,name",
            },
        });

        if (!response.data.data || response.data.data.length === 0) {
            throw new Error("No Facebook Pages found for this user");
        }

        // Use the first page
        return response.data.data[0].id;
    } catch (error) {
        console.error(
            "Error getting Facebook Page ID:",
            error.response?.data || error.message
        );
        throw new Error("Failed to get Facebook Page ID");
    }
}

// Map call to action to Facebook's format
function mapCallToAction(callToAction) {
    const mapping = {
        LEARN_MORE: "LEARN_MORE",
        SIGN_UP: "SIGN_UP",
        DOWNLOAD: "DOWNLOAD",
        SHOP_NOW: "SHOP_NOW",
        BOOK_TRAVEL: "BOOK_TRAVEL",
        CONTACT_US: "CONTACT_US",
        DONATE_NOW: "DONATE_NOW",
        GET_OFFER: "GET_OFFER",
        GET_QUOTE: "GET_QUOTE",
        SUBSCRIBE: "SUBSCRIBE",
    };

    return mapping[callToAction] || "LEARN_MORE";
}

// Get optimization goal based on campaign objective
function getOptimizationGoal(objective) {
    // Updated optimization goals to match the new Facebook objectives
    const mapping = {
        BRAND_AWARENESS: "BRAND_AWARENESS",
        REACH: "REACH",
        TRAFFIC: "LINK_CLICKS",
        ENGAGEMENT: "POST_ENGAGEMENT",
        APP_INSTALLS: "APP_INSTALLS",
        VIDEO_VIEWS: "VIDEO_VIEWS",
        LEAD_GENERATION: "LEAD_GENERATION",
        CONVERSIONS: "OFFSITE_CONVERSIONS",
        CATALOG_SALES: "PRODUCT_CATALOG_SALES",
        STORE_TRAFFIC: "STORE_VISITS",
    };

    // Note: The optimization goals haven't changed as much as the campaign objectives
    // But we should still handle the case where the objective doesn't map directly
    return mapping[objective] || "REACH";
}

// Launch a campaign on Facebook (change status to ACTIVE and verify campaign is ready)
exports.launchCampaign = async (platformCampaignId, user) => {
    try {
        // Check if user has connected to Facebook
        if (!user.platformCredentials.facebook?.isConnected) {
            throw new Error("User not connected to Facebook");
        }

        const accessToken = user.platformCredentials.facebook.accessToken;

        // First, check if the campaign exists and get its details
        const campaignResponse = await axios.get(
            `${FB_API_URL}/${platformCampaignId}`,
            {
                params: {
                    access_token: accessToken,
                    fields: "id,name,status,objective,special_ad_categories",
                },
            }
        );

        if (!campaignResponse.data || !campaignResponse.data.id) {
            throw new Error(`Campaign with ID ${platformCampaignId} not found`);
        }

        // Get ad sets for this campaign
        const adSetsResponse = await axios.get(
            `${FB_API_URL}/${platformCampaignId}/adsets`,
            {
                params: {
                    access_token: accessToken,
                    fields: "id,name,status,targeting,optimization_goal,billing_event,bid_amount,budget_remaining",
                },
            }
        );

        if (
            !adSetsResponse.data.data ||
            adSetsResponse.data.data.length === 0
        ) {
            throw new Error("Campaign does not have any ad sets");
        }

        // Check if ad sets have ads
        let hasAds = false;
        for (const adSet of adSetsResponse.data.data) {
            const adsResponse = await axios.get(
                `${FB_API_URL}/${adSet.id}/ads`,
                {
                    params: {
                        access_token: accessToken,
                        fields: "id,name,status,creative",
                    },
                }
            );

            if (adsResponse.data.data && adsResponse.data.data.length > 0) {
                hasAds = true;
                break;
            }
        }

        if (!hasAds) {
            throw new Error("Campaign does not have any ads");
        }

        // Update campaign status to ACTIVE
        await axios.post(
            `${FB_API_URL}/${platformCampaignId}`,
            {
                status: "ACTIVE",
            },
            {
                params: {
                    access_token: accessToken,
                },
            }
        );

        // Also activate all ad sets in the campaign
        for (const adSet of adSetsResponse.data.data) {
            await axios.post(
                `${FB_API_URL}/${adSet.id}`,
                {
                    status: "ACTIVE",
                },
                {
                    params: {
                        access_token: accessToken,
                    },
                }
            );

            // Get ads for this ad set and activate them
            const adsResponse = await axios.get(
                `${FB_API_URL}/${adSet.id}/ads`,
                {
                    params: {
                        access_token: accessToken,
                        fields: "id,name,status",
                    },
                }
            );

            if (adsResponse.data.data && adsResponse.data.data.length > 0) {
                for (const ad of adsResponse.data.data) {
                    await axios.post(
                        `${FB_API_URL}/${ad.id}`,
                        {
                            status: "ACTIVE",
                        },
                        {
                            params: {
                                access_token: accessToken,
                            },
                        }
                    );
                }
            }
        }

        return true;
    } catch (error) {
        console.error(
            "Error launching Facebook campaign:",
            error.response?.data || error.message
        );

        // Provide more specific error message
        if (error.response?.data?.error) {
            const fbError = error.response.data.error;
            throw new Error(
                `Failed to launch Facebook campaign: ${
                    fbError.message || fbError.type || JSON.stringify(fbError)
                }`
            );
        }

        throw new Error(`Failed to launch Facebook campaign: ${error.message}`);
    }
};
