const { body } = require("express-validator");

exports.albumCreateValidator = [
	body("title").trim().notEmpty().withMessage("Title is required"),
	body("description").optional().trim(),
];

exports.albumUpdateValidator = [
	body("title").optional().trim().notEmpty(),
	body("description").optional().trim(),
];