const prisma = require("../config/database");
const AppError = require("../utils/AppError");
const { slugify, generateUniqueSlug } = require("../utils/slugify");

exports.getAll = async (req, res, next) => {
	try {
		const campaigns = await prisma.campaign.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json({ success: true, data: campaigns });
	} catch (error) {
		next(error);
	}
};

exports.getOne = async (req, res, next) => {
	try {
		const campaign = await prisma.campaign.findUnique({
			where: { id: req.params.id },
		});
		if (!campaign) throw new AppError("Campaign not found", 404);
		res.status(200).json({ success: true, data: campaign });
	} catch (error) {
		next(error);
	}
};

exports.create = async (req, res, next) => {
	try {
		const {
			title,
			description,
			goalAmount,
			status,
			featured,
			startDate,
			endDate,
		} = req.body;
		const baseSlug = slugify(title);
		const slug = await generateUniqueSlug(baseSlug, prisma.campaign);

		const image = req.file ? req.file.path : null; // Cloudinary URL

		const campaign = await prisma.campaign.create({
			data: {
				title,
				slug,
				description,
				goalAmount: parseFloat(goalAmount),
				status: status || "draft",
				featured: featured === "true" || featured === true,
				startDate: startDate ? new Date(startDate) : null,
				endDate: endDate ? new Date(endDate) : null,
				image,
			},
		});

		res.status(201).json({ success: true, data: campaign });
	} catch (error) {
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const campaign = await prisma.campaign.findUnique({
			where: { id: req.params.id },
		});
		if (!campaign) throw new AppError("Campaign not found", 404);

		const {
			title,
			description,
			goalAmount,
			status,
			featured,
			startDate,
			endDate,
		} = req.body;
		let slug = campaign.slug;
		let image = campaign.image;

		if (title && title !== campaign.title) {
			const baseSlug = slugify(title);
			slug = await generateUniqueSlug(
				baseSlug,
				prisma.campaign,
				"slug",
				campaign.id,
			);
		}

		if (req.file) {
			// New Cloudinary URL replaces old one
			image = req.file.path;
		}

		const updated = await prisma.campaign.update({
			where: { id: campaign.id },
			data: {
				...(title && { title }),
				slug,
				...(description && { description }),
				...(goalAmount && { goalAmount: parseFloat(goalAmount) }),
				...(status && { status }),
				featured:
					featured !== undefined
						? featured === "true" || featured === true
						: campaign.featured,
				startDate: startDate ? new Date(startDate) : campaign.startDate,
				endDate: endDate ? new Date(endDate) : campaign.endDate,
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
		const campaign = await prisma.campaign.findUnique({
			where: { id: req.params.id },
		});
		if (!campaign) throw new AppError("Campaign not found", 404);

		await prisma.campaign.delete({ where: { id: campaign.id } });

		res.status(200).json({ success: true, message: "Campaign deleted" });
	} catch (error) {
		next(error);
	}
};