const prisma = require("../config/database");
const AppError = require("../utils/AppError");

exports.getAll = async (req, res, next) => {
	try {
		const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
		res.status(200).json({ success: true, data: faqs });
	} catch (error) {
		next(error);
	}
};

exports.create = async (req, res, next) => {
	try {
		const { question, answer, category, order } = req.body;
		if (!question || !answer) {
			throw new AppError("Question and answer are required", 400);
		}
		const faq = await prisma.faq.create({
			data: {
				question,
				answer,
				category: category || null,
				order: order || 0,
			},
		});
		res.status(201).json({ success: true, data: faq });
	} catch (error) {
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { question, answer, category, order } = req.body;
		const existing = await prisma.faq.findUnique({ where: { id } });
		if (!existing) throw new AppError("FAQ not found", 404);
		const faq = await prisma.faq.update({
			where: { id },
			data: {
				...(question && { question }),
				...(answer && { answer }),
				...(category !== undefined && { category }),
				...(order !== undefined && { order }),
			},
		});
		res.status(200).json({ success: true, data: faq });
	} catch (error) {
		next(error);
	}
};

exports.remove = async (req, res, next) => {
	try {
		const { id } = req.params;
		const existing = await prisma.faq.findUnique({ where: { id } });
		if (!existing) throw new AppError("FAQ not found", 404);
		await prisma.faq.delete({ where: { id } });
		res.status(200).json({ success: true, message: "FAQ deleted" });
	} catch (error) {
		next(error);
	}
};