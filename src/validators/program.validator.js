const { body } = require("express-validator");

const validCategories = ["Education", "Medical", "Food", "Emergency Relief"];

exports.createValidator = [
	body("title").trim().notEmpty().withMessage("Title is required"),
	body("description").trim().notEmpty().withMessage("Description is required"),
	body("category")
		.isIn(validCategories)
		.withMessage(`Category must be one of: ${validCategories.join(", ")}`),
];

exports.updateValidator = [
	body("title").optional().trim().notEmpty(),
	body("description").optional().trim().notEmpty(),
	body("category").optional().isIn(validCategories),
];