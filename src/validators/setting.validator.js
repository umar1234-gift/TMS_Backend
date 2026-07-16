const { body } = require("express-validator");

exports.updateValidator = [
	body().isObject().withMessage("Body must be a JSON object"),
];