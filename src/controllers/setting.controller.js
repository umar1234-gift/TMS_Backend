const prisma = require("../config/database");
const AppError = require("../utils/AppError");

exports.getAll = async (req, res, next) => {
	try {
		const settings = await prisma.siteSetting.findMany();
		// Convert to a key-value object for easier consumption by frontend
		const settingsObj = {};
		settings.forEach((s) => {
			settingsObj[s.key] = s.value;
		});
		res.status(200).json({ success: true, data: settingsObj });
	} catch (error) {
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const updates = req.body; // expected: { key1: value1, key2: value2, ... }
		if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
			throw new AppError(
				"Request body must be a plain object of key-value pairs",
				400,
			);
		}

		const operations = Object.entries(updates).map(([key, value]) =>
			prisma.siteSetting.upsert({
				where: { key },
				update: { value: String(value) },
				create: { key, value: String(value) },
			}),
		);

		await Promise.all(operations);

		// Fetch and return updated settings
		const settings = await prisma.siteSetting.findMany();
		const settingsObj = {};
		settings.forEach((s) => {
			settingsObj[s.key] = s.value;
		});
		res.status(200).json({ success: true, data: settingsObj });
	} catch (error) {
		next(error);
	}
};