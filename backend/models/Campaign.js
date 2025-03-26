const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a campaign name"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    objective: {
        type: String,
        required: [true, "Please add a campaign objective"],
        enum: [
            "BRAND_AWARENESS",
            "REACH",
            "TRAFFIC",
            "ENGAGEMENT",
            "APP_INSTALLS",
            "VIDEO_VIEWS",
            "LEAD_GENERATION",
            "CONVERSIONS",
            "CATALOG_SALES",
            "STORE_TRAFFIC",
        ],
    },
    budget: {
        daily: {
            type: Number,
            default: 0,
        },
        lifetime: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "USD",
        },
    },
    startDate: {
        type: Date,
        required: [true, "Please add a start date"],
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"],
        default: "DRAFT",
    },
    targetAudience: {
        locations: [
            {
                type: String,
            },
        ],
        ageRange: {
            min: {
                type: Number,
                min: 13,
                max: 65,
            },
            max: {
                type: Number,
                min: 13,
                max: 65,
            },
        },
        genders: [
            {
                type: String,
                enum: ["MALE", "FEMALE", "ALL"],
            },
        ],
        interests: [
            {
                type: String,
            },
        ],
        languages: [
            {
                type: String,
            },
        ],
    },
    platforms: [
        {
            platform: {
                type: String,
                required: true,
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
            },
            platformCampaignId: {
                type: String,
            },
            status: {
                type: String,
                enum: ["PENDING", "ACTIVE", "PAUSED", "COMPLETED", "ERROR"],
                default: "PENDING",
            },
            budget: {
                type: Number,
            },
            metrics: {
                impressions: {
                    type: Number,
                    default: 0,
                },
                clicks: {
                    type: Number,
                    default: 0,
                },
                conversions: {
                    type: Number,
                    default: 0,
                },
                spend: {
                    type: Number,
                    default: 0,
                },
                ctr: {
                    type: Number,
                    default: 0,
                },
                cpc: {
                    type: Number,
                    default: 0,
                },
                cpm: {
                    type: Number,
                    default: 0,
                },
            },
            lastSynced: {
                type: Date,
            },
        },
    ],
    creativeAssets: [
        {
            type: {
                type: String,
                enum: ["IMAGE", "VIDEO", "CAROUSEL", "TEXT"],
            },
            url: {
                type: String,
            },
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            callToAction: {
                type: String,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
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
CampaignSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Campaign", CampaignSchema);
