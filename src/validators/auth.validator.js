const { body } = require("express-validator");

exports.loginValidator = [
	body("email")
		.isEmail()
		.withMessage("Please provide a valid email")
		.normalizeEmail(),
	body("password").notEmpty().withMessage("Password is required"),
];

exports.updateProfileValidator = [
	body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
	body("email")
		.optional()
		.isEmail()
		.withMessage("Please provide a valid email")
		.normalizeEmail(),
];

exports.changePasswordValidator = [
	body("currentPassword")
		.notEmpty()
		.withMessage("Current password is required"),
	body("newPassword")
		.isLength({ min: 6 })
		.withMessage("New password must be at least 6 characters"),
];