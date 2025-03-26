const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please add a first name"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Please add a last name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    phone: {
        type: String,
    },
    source: {
        platform: {
            type: String,
            required: true,
            enum: [
                "FACEBOOK",
                "INSTAGRAM",
                "GOOGLE",
                "YOUTUBE",
                "LINKEDIN",
                "TWITTER",
                "SNAPCHAT",
                "WHATSAPP",
            ],
        },
        campaignId: {
            type: String,
        },
        adId: {
            type: String,
        },
    },
    campaign: {
        type: mongoose.Schema.ObjectId,
        ref: "Campaign",
        required: true,
    },
    status: {
        type: String,
        enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "DISQUALIFIED"],
        default: "NEW",
    },
    additionalInfo: {
        type: Map,
        of: String,
    },
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
LeadSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Lead", LeadSchema);
