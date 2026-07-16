const prisma = require("../config/database");
const AppError = require("../utils/AppError");

exports.getAll = async (req, res, next) => {
	try {
		const volunteers = await prisma.volunteer.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json({ success: true, data: volunteers });
	} catch (error) {
		next(error);
	}
};

exports.getOne = async (req, res, next) => {
	try {
		const volunteer = await prisma.volunteer.findUnique({
			where: { id: req.params.id },
		});
		if (!volunteer) throw new AppError("Volunteer not found", 404);
		res.status(200).json({ success: true, data: volunteer });
	} catch (error) {
		next(error);
	}
};

exports.updateStatus = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		if (!["pending", "approved", "rejected"].includes(status)) {
			throw new AppError("Invalid status", 400);
		}
		const volunteer = await prisma.volunteer.findUnique({ where: { id } });
		if (!volunteer) throw new AppError("Volunteer not found", 404);

		const updated = await prisma.volunteer.update({
			where: { id },
			data: { status },
		});
		res.status(200).json({ success: true, data: updated });
	} catch (error) {
		next(error);
	}
};