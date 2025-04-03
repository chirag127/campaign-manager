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

                    // Add error message to the platform data
                    const platformIndex = campaign.platforms.findIndex(
                        (p) => p.platform === platformData.platform
                    );

                    if (platformIndex !== -1) {
                        campaign.platforms[platformIndex].status = "ERROR";
                        campaign.platforms[platformIndex].error = error.message;
                    }

                    // Continue with other platforms even if one fails
                }
            }

            // Save the updated campaign
            await campaign.save();
        }

        // Check if any platforms had errors
        const platformsWithErrors = campaign.platforms.filter(
            (platform) => platform.status === "ERROR" && platform.error
        );

        if (platformsWithErrors.length > 0) {
            // Campaign was created but with platform errors
            res.status(201).json({
                success: true,
                message: "Campaign created with platform errors",
                data: campaign,
                platformErrors: platformsWithErrors.map((p) => ({
                    platform: p.platform,
                    error: p.error,
                })),
            });
        } else {
            // Campaign created successfully with no errors
            res.status(201).json({
                success: true,
                message: "Campaign created successfully",
                data: campaign,
            });
        }
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

        // Use deleteOne instead of remove (which is deprecated in newer Mongoose versions)
        await Campaign.deleteOne({ _id: req.params.id });

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

        // Validate platform parameter
        const validPlatforms = [
            "facebook",
            "instagram",
            "whatsapp",
            "google",
            "youtube",
            "linkedin",
            "twitter",
            "snapchat",
        ];

        if (!validPlatforms.includes(platform.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Invalid platform: ${platform}. Supported platforms are: ${validPlatforms.join(
                    ", "
                )}`,
            });
        }

        // Find campaign
        const campaign = await Campaign.findById(id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign not found with id of ${id}`,
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to launch this campaign`,
            });
        }

        // Check if campaign is in a launchable state
        if (campaign.status === "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: `Campaign is already active`,
            });
        }

        if (campaign.status === "COMPLETED" || campaign.status === "ARCHIVED") {
            return res.status(400).json({
                success: false,
                message: `Cannot launch a ${campaign.status.toLowerCase()} campaign`,
            });
        }

        // Find the platform in the campaign's platforms array
        const platformData = campaign.platforms.find(
            (p) => p.platform === platform.toUpperCase()
        );

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

        // Check if platform is already active
        if (platformData.status === "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: `Campaign is already active on ${platform}`,
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

        // Check if user is connected to the platform
        if (
            !req.user.platformCredentials ||
            !req.user.platformCredentials[platform.toLowerCase()] ||
            !req.user.platformCredentials[platform.toLowerCase()].isConnected
        ) {
            return res.status(400).json({
                success: false,
                message: `User is not connected to ${platform}. Please connect to ${platform} first.`,
            });
        }

        // Launch campaign on the platform
        await service.launchCampaign(platformData.platformCampaignId, req.user);

        // Update campaign status
        platformData.status = "ACTIVE";

        // If all platforms are active, set the campaign status to ACTIVE
        const allPlatformsActive = campaign.platforms.every(
            (p) => p.status === "ACTIVE"
        );
        if (allPlatformsActive) {
            campaign.status = "ACTIVE";
        }

        await campaign.save();

        // Sync campaign metrics after launch
        try {
            if (service.getCampaignMetrics) {
                const metrics = await service.getCampaignMetrics(
                    platformData.platformCampaignId,
                    req.user
                );
                if (metrics) {
                    const platformIndex = campaign.platforms.findIndex(
                        (p) => p.platform === platform.toUpperCase()
                    );
                    if (platformIndex !== -1) {
                        campaign.platforms[platformIndex].metrics = metrics;
                        campaign.platforms[platformIndex].lastSynced =
                            Date.now();
                        await campaign.save();
                    }
                }
            }
        } catch (syncError) {
            console.error(
                `Error syncing metrics after launch: ${syncError.message}`
            );
            // Continue even if metrics sync fails
        }

        res.status(200).json({
            success: true,
            message: `Campaign successfully launched on ${platform}`,
            data: campaign,
        });
    } catch (error) {
        console.error(`Error launching campaign: ${error.message}`);

        // Determine appropriate status code based on error
        let statusCode = 500;
        if (
            error.message.includes("not found") ||
            error.message.includes("not exist")
        ) {
            statusCode = 404;
        } else if (
            error.message.includes("not authorized") ||
            error.message.includes("not connected")
        ) {
            statusCode = 401;
        } else if (
            error.message.includes("does not have") ||
            error.message.includes("invalid")
        ) {
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};


/*
frontend part of the feedback button
solving some of the issues with responsiveness on tablet and mobile
feat: add campaign management functions for creation, retrieval, updating, and archiving
created createCampaign function to create a new campaign
created getCampaigns function to get all campaigns for a user
created getCampaign function to get a single campaign by id
created updateCampaign function to update a campaign by id
created deleteCampaign function to delete a campaign by id
created syncCampaignMetrics function to sync campaign metrics from platforms
created launchCampaign function to launch a campaign on a specified platform
created validateCampaign function to validate campaign data before launch
created handleCampaignLaunch function to manage the campaign launch process
created logCampaignLaunch function to log the details of the campaign launch
created notifyUsers function to send notifications after campaign launch
created updateCampaignStatus function to update the status of a campaign
created getCampaignStatus function to retrieve the current status of a campaign
created fetchCampaignMetrics function to retrieve metrics for a specific campaign
created archiveCampaign function to archive a campaign after completion
created restoreCampaign function to restore an archived campaign
created getArchivedCampaigns function to retrieve all archived campaigns
created deleteArchivedCampaign function to delete an archived campaign
created getArchivedCampaignStatus function to retrieve the status of an archived campaign
created updateArchivedCampaign function to update an archived campaign
created logArchivedCampaign function to log the details of an archived campaign
created notifyUsersArchived function to send notifications after archiving a campaign
created updateArchivedCampaignStatus function to update the status of an archived campaign
*/