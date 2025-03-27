const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

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
    (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
            }

            // Create file URL
            const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
                req.file.filename
            }`;

            console.log("File uploaded successfully:", req.file.filename);

            res.status(200).json({
                success: true,
                data: {
                    filename: req.file.filename,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    url: fileUrl,
                },
            });
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
