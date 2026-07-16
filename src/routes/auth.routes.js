const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validator"); // We'll create a validate middleware shortly
const {
	loginValidator,
	updateProfileValidator,
	changePasswordValidator,
} = require("../validators/auth.validator");

const router = express.Router();
router.get("/ping", (req, res) => res.json({ message: "auth routes working" }));
router.post("/login", loginValidator, validate, authController.login);

// All routes below require authentication
router.use(authMiddleware);

router.get("/profile", authController.getProfile);
router.put(
	"/profile",
	updateProfileValidator,
	validate,
	authController.updateProfile,
);
router.put(
	"/change-password",
	changePasswordValidator,
	validate,
	authController.changePassword,
);

module.exports = router;