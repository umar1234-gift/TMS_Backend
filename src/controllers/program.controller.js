const prisma = require("../config/database");
const AppError = require("../utils/AppError");
const { slugify, generateUniqueSlug } = require("../utils/slugify");

exports.getAll = async (req, res, next) => {
	try {
		const programs = await prisma.program.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json({ success: true, data: programs });
	} catch (error) {
		next(error);
	}
};

exports.getOne = async (req, res, next) => {
	try {
		const program = await prisma.program.findUnique({
			where: { id: req.params.id },
		});
		if (!program) throw new AppError("Program not found", 404);
		res.status(200).json({ success: true, data: program });
	} catch (error) {
		next(error);
	}
};

exports.create = async (req, res, next) => {
	try {
		const { title, description, category } = req.body;
		const baseSlug = slugify(title);
		const slug = await generateUniqueSlug(baseSlug, prisma.program);
		const image = req.file ? req.file.path : null;

		const program = await prisma.program.create({
			data: { title, slug, description, category, image },
		});
		res.status(201).json({ success: true, data: program });
	} catch (error) {
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const program = await prisma.program.findUnique({
			where: { id: req.params.id },
		});
		if (!program) throw new AppError("Program not found", 404);

		const { title, description, category } = req.body;
		let slug = program.slug;
		let image = program.image;

		if (title && title !== program.title) {
			const baseSlug = slugify(title);
			slug = await generateUniqueSlug(
				baseSlug,
				prisma.program,
				"slug",
				program.id,
			);
		}

		if (req.file) {
			image = req.file.path;
		}

		const updated = await prisma.program.update({
			where: { id: program.id },
			data: {
				...(title && { title }),
				slug,
				...(description && { description }),
				...(category && { category }),
				image,
			},
		});
		res.status(200).json({ success: true, data: updated });
	} catch (error) {
		next(error);
	}
};

exports.remove = async (req, res, next) => {
	try {
		const program = await prisma.program.findUnique({
			where: { id: req.params.id },
		});
		if (!program) throw new AppError("Program not found", 404);
		await prisma.program.delete({ where: { id: program.id } });
		res.status(200).json({ success: true, message: "Program deleted" });
	} catch (error) {
		next(error);
	}
};