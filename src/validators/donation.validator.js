const { body } = require("express-validator");

exports.updateStatusValidator = [
	body("status")
		.optional()
		.isIn(["pending", "approved", "rejected"])
		.withMessage("Invalid status"),
	body("receiptUrl")
		.optional()
		.isURL()
		.withMessage("Receipt URL must be a valid URL"),
];