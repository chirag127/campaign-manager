const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/auth");
const { uploadToFreeImageHost } = require("../utils/imageUpload");

const router = express.Router();

// Use memory storage since we'll be uploading to FreeImageHost
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images and videos
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed"), false);
    }
};

// Configure upload
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        console.error("Multer error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || "Error uploading file",
        });
    } else if (err) {
        // An unknown error occurred
        console.error("Upload error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Error uploading file",
        });
    }
    next();
};

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
router.post(
    "/",
    protect,
    (req, res, next) => {
        // Log the request for debugging
        console.log("Upload request received:", {
            contentType: req.headers["content-type"],
            hasBody: !!req.body,
        });
        next();
    },
    upload.single("file"),
    handleMulterError,
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
            }

            // Check if the file is an image
            if (req.file.mimetype.startsWith("image/")) {
                // Convert buffer to base64
                const base64Image = req.file.buffer.toString("base64");

                // Upload to FreeImageHost
                const imageUrl = await uploadToFreeImageHost(base64Image);

                console.log("Image uploaded to FreeImageHost:", imageUrl);

                res.status(200).json({
                    success: true,
                    data: {
                        filename: req.file.originalname,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        url: imageUrl,
                    },
                });
            } else {
                // For non-image files (like videos), we'll need to handle differently
                // FreeImageHost only supports images, so we might need another service for videos
                return res.status(400).json({
                    success: false,
                    message:
                        "Only image uploads are currently supported with FreeImageHost",
                });
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Error uploading file",
            });
        }
    }
);

module.exports = router;
