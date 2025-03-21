const express = require("express");
const {
    getPlatforms,
    getPlatform,
    connectPlatform,
    disconnectPlatform,
    getConnectedPlatforms,
} = require("../controllers/platformController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, getPlatforms);

// Specific routes must come before parameterized routes
router.get("/connected", protect, getConnectedPlatforms);

router.post("/:platform/connect", protect, connectPlatform);
router.post("/:platform/disconnect", protect, disconnectPlatform);

// Generic parameterized route should be last
router.route("/:id").get(protect, getPlatform);

module.exports = router;
