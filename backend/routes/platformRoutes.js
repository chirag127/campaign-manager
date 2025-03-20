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

router.route("/:id").get(protect, getPlatform);

router.post("/:platform/connect", protect, connectPlatform);
router.post("/:platform/disconnect", protect, disconnectPlatform);
router.get("/connected", protect, getConnectedPlatforms);

module.exports = router;
