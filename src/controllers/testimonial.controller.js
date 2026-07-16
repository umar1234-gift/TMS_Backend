const prisma = require("../config/database");
const AppError = require("../utils/AppError");

exports.getAll = async (req, res, next) => {
	try {
		const testimonials = await prisma.testimonial.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.json({ success: true, data: testimonials });
	} catch (error) {
		next(error);
	}
};
exports.create = async (req, res, next) => {
	try {
		const { name, role, quote } = req.body;
		const testimonial = await prisma.testimonial.create({
			data: { name, role, quote },
		});
		res.status(201).json({ success: true, data: testimonial });
	} catch (error) {
		next(error);
	}
};
exports.update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, role, quote, active } = req.body;
		const testimonial = await prisma.testimonial.update({
			where: { id },
			data: { name, role, quote, active },
		});
		res.json({ success: true, data: testimonial });
	} catch (error) {
		next(error);
	}
};
exports.remove = async (req, res, next) => {
	try {
		await prisma.testimonial.delete({ where: { id: req.params.id } });
		res.json({ success: true, message: "Deleted" });
	} catch (error) {
		next(error);
	}
};