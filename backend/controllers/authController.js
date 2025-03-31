const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Lead = require("../models/Lead");
const sendEmail = require("../services/emailService");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Send token response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email and password",
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};

// @desc    Delete user account and all associated data
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        // Verify password before deletion
        if (password) {
            // Get user with password
            const user = await User.findById(userId).select("+password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            // Verify password
            const isMatch = await user.matchPassword(password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password. Account deletion failed.",
                });
            }

            // Delete all campaigns associated with the user
            await Campaign.deleteMany({ user: userId });

            // Delete all leads associated with the user
            await Lead.deleteMany({ user: userId });

            // Delete the user
            await User.findByIdAndDelete(userId);

            return res.status(200).json({
                success: true,
                message: "Account and all associated data deleted successfully",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Password is required to delete account",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email address",
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with that email",
            });
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();

        // Save the user with the reset token and expiry
        await user.save({ validateBeforeSave: false });

        // Create reset password email
        const resetText = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please use the following code to reset your password:</p>
            <h2>${resetToken}</h2>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;

        try {
            await sendEmail(
                user.email,
                "Password Reset Code",
                resetText
            );

            res.status(200).json({
                success: true,
                message: "Reset code sent to email",
            });
        } catch (error) {
            // If email fails, clear the reset token and expiry
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: "Email could not be sent",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, resetCode, password } = req.body;

        if (!email || !resetCode || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, reset code and new password",
            });
        }

        // Find user by email and valid reset token
        const user = await User.findOne({
            email,
            resetPasswordToken: resetCode,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset code",
            });
        }

        // Set new password
        user.password = password;

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Save user with new password
        await user.save();

        // Send success response
        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Verify reset code
// @route   POST /api/auth/verify-reset-code
// @access  Public
exports.verifyResetCode = async (req, res) => {
    try {
        const { email, resetCode } = req.body;

        if (!email || !resetCode) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and reset code",
            });
        }

        // Find user by email and valid reset token
        const user = await User.findOne({
            email,
            resetPasswordToken: resetCode,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset code",
            });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: "Reset code is valid",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        user,
    });
};

/*
created register function to register a user
created login function to login a user
created getMe function to get the current logged in user
created logout function to logout a user


*/
