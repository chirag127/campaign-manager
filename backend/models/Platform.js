const mongoose = require("mongoose");

const PlatformSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a platform name"],
        enum: [
            "FACEBOOK",
            "INSTAGRAM",
            "WHATSAPP",
            "GOOGLE",
            "YOUTUBE",
            "LINKEDIN",
            "TWITTER",
            "SNAPCHAT",
        ],
        unique: true,
    },
    description: {
        type: String,
    },
    apiEndpoints: {
        type: Map,
        of: String,
    },
    requiredCredentials: [
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            isRequired: {
                type: Boolean,
                default: true,
            },
        },
    ],
    capabilities: [
        {
            type: String,
            enum: [
                "CREATE_CAMPAIGN",
                "READ_CAMPAIGN",
                "UPDATE_CAMPAIGN",
                "DELETE_CAMPAIGN",
                "CREATE_AD",
                "READ_AD",
                "UPDATE_AD",
                "DELETE_AD",
                "READ_METRICS",
                "READ_LEADS",
                "EXPORT_LEADS",
            ],
        },
    ],
    status: {
        type: String,
        enum: ["ACTIVE", "MAINTENANCE", "DEPRECATED"],
        default: "ACTIVE",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt field on save
PlatformSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Platform", PlatformSchema);
