const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    platformCredentials: {
        facebook: {
            accessToken: String,
            refreshToken: String,
            expiresAt: Date,
            isConnected: {
                type: Boolean,
                default: false,
            },
        },
        google: {
            accessToken: String,
            refreshToken: String,
            expiresAt: Date,
            isConnected: {
                type: Boolean,
                default: false,
            },
        },
        linkedin: {
            accessToken: String,
            refreshToken: String,
            expiresAt: Date,
            isConnected: {
                type: Boolean,
                default: false,
            },
        },
        twitter: {
            accessToken: String,
            accessTokenSecret: String,
            isConnected: {
                type: Boolean,
                default: false,
            },
        },
        snapchat: {
            accessToken: String,
            refreshToken: String,
            expiresAt: Date,
            isConnected: {
                type: Boolean,
                default: false,
            },
        },
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate a 6-digit reset code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = resetToken;

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
