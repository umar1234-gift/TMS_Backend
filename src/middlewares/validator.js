const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

exports.validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const messages = errors
			.array()
			.map((err) => err.msg)
			.join(", ");
		throw new AppError(messages, 400);
	}
	next();
};