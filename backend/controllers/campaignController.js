const Campaign = require("../models/Campaign");
const platformServices = require("../services");

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
    try {

        // Add user to req.body
        req.body.user = req.user.id;

        // Create campaign
        const campaign = await Campaign.create(req.body);

        // If platforms are specified, create campaigns on those platforms
        if (req.body.platforms && req.body.platforms.length > 0) {
            for (const platformData of req.body.platforms) {
                try {
                    const { platform } = platformData;

                    // Get the appropriate service for the platform
                    const service = platformServices[platform.toLowerCase()];

                    if (service) {
                        // Create campaign on the platform
                        const platformCampaignId = await service.createCampaign(
                            campaign,
                            req.user
                        );

                        // Update the campaign with the platform campaign ID
                        if (platformCampaignId) {
                            // Find the platform in the campaign's platforms array
                            const platformIndex = campaign.platforms.findIndex(
                                (p) => p.platform === platform
                            );

                            if (platformIndex !== -1) {
                                campaign.platforms[
                                    platformIndex
                                ].platformCampaignId = platformCampaignId;
                                campaign.platforms[platformIndex].status =
                                    "ACTIVE";
                            }
                        }
                    }
                } catch (error) {
                    console.error(
                        `Error creating campaign on ${platformData.platform}:`,
                        error
                    );
                    // Continue with other platforms even if one fails
                }
            }

            // Save the updated campaign
            await campaign.save();
        }

        res.status(201).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
exports.getCampaigns = async (req, res) => {
    try {
        // Find campaigns for the logged-in user
        const campaigns = await Campaign.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: campaigns.length,
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign not found with id of ${req.params.id}`,
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to access this campaign`,
            });
        }

        res.status(200).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res) => {
    try {
        let campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign not found with id of ${req.params.id}`,
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this campaign`,
            });
        }

        // Update campaign
        campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        // Update campaign on platforms
        if (campaign.platforms && campaign.platforms.length > 0) {
            for (const platformData of campaign.platforms) {
                try {
                    const { platform, platformCampaignId } = platformData;

                    // Skip if no platform campaign ID (not yet created on platform)
                    if (!platformCampaignId) continue;

                    // Get the appropriate service for the platform
                    const service = platformServices[platform.toLowerCase()];

                    if (service) {
                        // Update campaign on the platform
                        await service.updateCampaign(
                            platformCampaignId,
                            campaign,
                            req.user
                        );
                    }
                } catch (error) {
                    console.error(
                        `Error updating campaign on ${platformData.platform}:`,
                        error
                    );
                    // Continue with other platforms even if one fails
                }
            }
        }

        res.status(200).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign not found with id of ${req.params.id}`,
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this campaign`,
            });
        }

        // Delete campaign on platforms
        if (campaign.platforms && campaign.platforms.length > 0) {
            for (const platformData of campaign.platforms) {
                try {
                    const { platform, platformCampaignId } = platformData;

                    // Skip if no platform campaign ID (not yet created on platform)
                    if (!platformCampaignId) continue;

                    // Get the appropriate service for the platform
                    const service = platformServices[platform.toLowerCase()];

                    if (service) {
                        // Delete campaign on the platform
                        await service.deleteCampaign(
                            platformCampaignId,
                            req.user
                        );
                    }
                } catch (error) {
                    console.error(
                        `Error deleting campaign on ${platformData.platform}:`,
                        error
                    );
                    // Continue with other platforms even if one fails
                }
            }
        }

        await campaign.remove();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Sync campaign metrics from platforms
// @route   GET /api/campaigns/:id/sync
// @access  Private
exports.syncCampaignMetrics = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign not found with id of ${req.params.id}`,
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to sync this campaign`,
            });
        }

        // Sync metrics from platforms
        if (campaign.platforms && campaign.platforms.length > 0) {
            for (const platformData of campaign.platforms) {
                try {
                    const { platform, platformCampaignId } = platformData;

                    // Skip if no platform campaign ID (not yet created on platform)
                    if (!platformCampaignId) continue;

                    // Get the appropriate service for the platform
                    const service = platformServices[platform.toLowerCase()];

                    if (service) {
                        // Get metrics from the platform
                        const metrics = await service.getCampaignMetrics(
                            platformCampaignId,
                            req.user
                        );

                        if (metrics) {
                            // Find the platform in the campaign's platforms array
                            const platformIndex = campaign.platforms.findIndex(
                                (p) => p.platform === platform
                            );

                            if (platformIndex !== -1) {
                                campaign.platforms[platformIndex].metrics =
                                    metrics;
                                campaign.platforms[platformIndex].lastSynced =
                                    Date.now();
                            }
                        }
                    }
                } catch (error) {
                    console.error(
                        `Error syncing metrics from ${platformData.platform}:`,
                        error
                    );
                    // Continue with other platforms even if one fails
                }
            }

            // Save the updated campaign
            await campaign.save();
        }

        res.status(200).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Launch campaign on platform
// @route   POST /api/campaigns/:id/launch/:platform
// @access  Private
exports.launchCampaign = async (req, res) => {
    try {
        const { id, platform } = req.params;

        // Find campaign
        const campaign = await Campaign.findById(id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign not found with id of ${id}`,
            });
        }

        // Make sure user owns the campaign
        if (campaign.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to launch this campaign`,
            });
        }

        // Find the platform in the campaign's platforms array
        const platformData = campaign.platforms.find(p => p.platform === platform.toUpperCase());

        if (!platformData) {
            return res.status(404).json({
                success: false,
                message: `Platform ${platform} not found in campaign`,
            });
        }

        if (!platformData.platformCampaignId) {
            return res.status(400).json({
                success: false,
                message: `Campaign not yet created on ${platform}`,
            });
        }

        // Get the appropriate service for the platform
        const service = platformServices[platform.toLowerCase()];

        if (!service || !service.launchCampaign) {
            return res.status(400).json({
                success: false,
                message: `Launch functionality not available for ${platform}`,
            });
        }

        // Launch campaign on the platform
        await service.launchCampaign(platformData.platformCampaignId, req.user);

        // Update campaign status
        platformData.status = "ACTIVE";
        campaign.status = "ACTIVE";
        await campaign.save();

        res.status(200).json({
            success: true,
            message: `Campaign successfully launched on ${platform}`,
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};