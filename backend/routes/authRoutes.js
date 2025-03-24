const express = require("express");
const {
    register,
    login,
    getMe,
    logout,
    deleteAccount,
    forgotPassword,
    resetPassword,
    verifyResetCode
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);
router.delete("/delete-account", protect, deleteAccount);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-code", verifyResetCode);

module.exports = router;
