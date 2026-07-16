const prisma = require("../config/database");
const AppError = require("../utils/AppError");

exports.getAll = async (req, res, next) => {
	try {
		const messages = await prisma.contactMessage.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json({ success: true, data: messages });
	} catch (error) {
		next(error);
	}
};

exports.getOne = async (req, res, next) => {
	try {
		const message = await prisma.contactMessage.findUnique({
			where: { id: req.params.id },
		});
		if (!message) throw new AppError("Message not found", 404);
		res.status(200).json({ success: true, data: message });
	} catch (error) {
		next(error);
	}
};

exports.toggleRead = async (req, res, next) => {
	try {
		const { id } = req.params;
		const message = await prisma.contactMessage.findUnique({ where: { id } });
		if (!message) throw new AppError("Message not found", 404);

		const updated = await prisma.contactMessage.update({
			where: { id },
			data: { read: !message.read },
		});
		res.status(200).json({ success: true, data: updated });
	} catch (error) {
		next(error);
	}
};