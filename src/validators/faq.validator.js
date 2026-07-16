const { body } = require("express-validator");

exports.createValidator = [
	body("question").trim().notEmpty().withMessage("Question is required"),
	body("answer").trim().notEmpty().withMessage("Answer is required"),
	body("category").optional().trim(),
	body("order").optional().isInt({ min: 0 }),
];

exports.updateValidator = [
	body("question").optional().trim().notEmpty(),
	body("answer").optional().trim().notEmpty(),
	body("category").optional().trim(),
	body("order").optional().isInt({ min: 0 }),
];