const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const { jwtSecret } = require("../config/env");
const AppError = require("../utils/AppError");

const authMiddleware = async (req, res, next) => {
	try {
		// 1. Get token from header
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			throw new AppError(
				"You are not logged in. Please log in to access this resource.",
				401,
			);
		}

		// 2. Verify token
		const decoded = jwt.verify(token, jwtSecret);

		// 3. Check if admin still exists
		const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
		if (!admin) {
			throw new AppError(
				"The admin belonging to this token no longer exists.",
				401,
			);
		}

		// 4. Attach admin to request
		req.admin = admin;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = authMiddleware;