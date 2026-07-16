const { body } = require("express-validator");

exports.updateStatusValidator = [
	body("status")
		.isIn(["pending", "approved", "rejected"])
		.withMessage("Invalid status"),
];