const { body, param } = require("express-validator");

// Categories
exports.categoryCreateValidator = [
	body("name").trim().notEmpty().withMessage("Category name is required"),
];

exports.categoryUpdateValidator = [body("name").optional().trim().notEmpty()];

// Posts
exports.postCreateValidator = [
	body("title").trim().notEmpty().withMessage("Title is required"),
	body("content").trim().notEmpty().withMessage("Content is required"),
	body("excerpt").optional().trim(),
	body("categoryId").optional(),
	body("published").optional().isBoolean(),
];

exports.postUpdateValidator = [
	body("title").optional().trim().notEmpty(),
	body("content").optional().trim().notEmpty(),
	body("excerpt").optional().trim(),
	body("categoryId").optional(),
	body("published").optional().isBoolean(),
];