const { body } = require("express-validator");

exports.createValidator = [
	body("title").trim().notEmpty().withMessage("Title is required"),
	body("description").trim().notEmpty().withMessage("Description is required"),
	body("goalAmount")
		.isFloat({ min: 0 })
		.withMessage("Goal amount must be a positive number"),
	body("status").optional().isIn(["draft", "active", "completed"]),
	body("featured").optional().isBoolean(),
	body("startDate").optional().isISO8601().toDate(),
	body("endDate").optional().isISO8601().toDate(),
];

exports.updateValidator = [
	body("title").optional().trim().notEmpty(),
	body("description").optional().trim().notEmpty(),
	body("goalAmount").optional().isFloat({ min: 0 }),
	body("status").optional().isIn(["draft", "active", "completed"]),
	body("featured").optional().isBoolean(),
	body("startDate").optional().isISO8601().toDate(),
	body("endDate").optional().isISO8601().toDate(),
];