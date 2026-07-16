const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const { jwtSecret, jwtExpire } = require("../config/env");
const AppError = require("../utils/AppError");

// Generate JWT token
const signToken = (adminId) => {
	return jwt.sign({ id: adminId }, jwtSecret, { expiresIn: jwtExpire });
};

// Admin login
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// 1. Check if admin exists
		const admin = await prisma.admin.findUnique({ where: { email } });
		if (!admin) {
			throw new AppError("Invalid email or password", 401);
		}

		// 2. Compare password
		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch) {
			throw new AppError("Invalid email or password", 401);
		}

		// 3. Generate token
		const token = signToken(admin.id);

		// 4. Remove password from output
		const { password: _, ...adminData } = admin;

		res.status(200).json({
			success: true,
			token,
			data: adminData,
		});
	} catch (error) {
		next(error);
	}
};

// Get current admin profile
exports.getProfile = async (req, res, next) => {
	try {
		const admin = await prisma.admin.findUnique({
			where: { id: req.admin.id },
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		res.status(200).json({
			success: true,
			data: admin,
		});
	} catch (error) {
		next(error);
	}
};

// Update admin profile (name and/or email)
exports.updateProfile = async (req, res, next) => {
	try {
		const { name, email } = req.body;

		// Prevent duplicate email if changed
		if (email) {
			const existing = await prisma.admin.findUnique({ where: { email } });
			if (existing && existing.id !== req.admin.id) {
				throw new AppError("Email already in use", 400);
			}
		}

		const updatedAdmin = await prisma.admin.update({
			where: { id: req.admin.id },
			data: {
				...(name && { name }),
				...(email && { email }),
			},
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		res.status(200).json({
			success: true,
			data: updatedAdmin,
		});
	} catch (error) {
		next(error);
	}
};

// Change password
exports.changePassword = async (req, res, next) => {
	try {
		const { currentPassword, newPassword } = req.body;

		// 1. Get admin with password
		const admin = await prisma.admin.findUnique({
			where: { id: req.admin.id },
		});

		// 2. Verify current password
		const isMatch = await bcrypt.compare(currentPassword, admin.password);
		if (!isMatch) {
			throw new AppError("Current password is incorrect", 401);
		}

		// 3. Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		// 4. Update password
		await prisma.admin.update({
			where: { id: req.admin.id },
			data: { password: hashedPassword },
		});

		res.status(200).json({
			success: true,
			message: "Password changed successfully",
		});
	} catch (error) {
		next(error);
	}
};