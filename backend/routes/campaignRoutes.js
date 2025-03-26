const express = require("express");
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    syncCampaignMetrics,
    launchCampaign,
} = require("../controllers/campaignController");
const { syncCampaignLeads } = require("../controllers/leadController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, getCampaigns).post(protect, createCampaign);

router
    .route("/:id")
    .get(protect, getCampaign)
    .put(protect, updateCampaign)
    .delete(protect, deleteCampaign);

router.get("/:id/sync", protect, syncCampaignMetrics);
router.get("/:campaignId/sync-leads", protect, syncCampaignLeads);
router.post("/:id/launch/:platform", protect, launchCampaign);

module.exports = router;
