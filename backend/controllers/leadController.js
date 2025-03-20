const Lead = require("../models/Lead");
const Campaign = require("../models/Campaign");
const platformServices = require("../services");

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
    try {
        // Find leads for the logged-in user
        const leads = await Lead.find({ user: req.user.id }).populate({
            path: "campaign",
            select: "name",
        });

        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate({
            path: "campaign",
            select: "name",
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: `Lead not found with id of ${req.params.id}`,
            });
        }

        // Make sure user owns the lead
        if (lead.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to access this lead`,
            });
        }

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        // Check if campaign exists
        const campaign = await Campaign.findById(req.body.campaign);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign not found with id of ${req.body.campaign}`,
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to add a lead to this campaign`,
            });
        }

        // Create lead
        const lead = await Lead.create(req.body);

        res.status(201).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: `Lead not found with id of ${req.params.id}`,
            });
        }

        // Make sure user owns the lead
        if (lead.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this lead`,
            });
        }

        // Update lead
        lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: `Lead not found with id of ${req.params.id}`,
            });
        }

        // Make sure user owns the lead
        if (lead.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this lead`,
            });
        }

        await lead.remove();

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

// @desc    Sync leads from platforms for a campaign
// @route   GET /api/campaigns/:campaignId/sync-leads
// @access  Private
exports.syncCampaignLeads = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.campaignId);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign not found with id of ${req.params.campaignId}`,
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to sync leads for this campaign`,
            });
        }

        let newLeadsCount = 0;

        // Sync leads from platforms
        if (campaign.platforms && campaign.platforms.length > 0) {
            for (const platformData of campaign.platforms) {
                try {
                    const { platform, platformCampaignId } = platformData;

                    // Skip if no platform campaign ID (not yet created on platform)
                    if (!platformCampaignId) continue;

                    // Get the appropriate service for the platform
                    const service = platformServices[platform.toLowerCase()];

                    if (service) {
                        // Get leads from the platform
                        const platformLeads = await service.getCampaignLeads(
                            platformCampaignId,
                            req.user
                        );

                        if (platformLeads && platformLeads.length > 0) {
                            for (const platformLead of platformLeads) {
                                // Check if lead already exists
                                const existingLead = await Lead.findOne({
                                    email: platformLead.email,
                                    campaign: campaign._id,
                                    "source.platform": platform,
                                });

                                if (!existingLead) {
                                    // Create new lead
                                    await Lead.create({
                                        firstName: platformLead.firstName,
                                        lastName: platformLead.lastName,
                                        email: platformLead.email,
                                        phone: platformLead.phone,
                                        source: {
                                            platform,
                                            campaignId: platformCampaignId,
                                            adId: platformLead.adId,
                                        },
                                        campaign: campaign._id,
                                        additionalInfo:
                                            platformLead.additionalInfo,
                                        user: req.user.id,
                                    });

                                    newLeadsCount++;
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(
                        `Error syncing leads from ${platformData.platform}:`,
                        error
                    );
                    // Continue with other platforms even if one fails
                }
            }
        }

        res.status(200).json({
            success: true,
            data: {
                newLeadsCount,
                message: `Successfully synced ${newLeadsCount} new leads`,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
