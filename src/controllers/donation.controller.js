const prisma = require("../config/database");
const AppError = require("../utils/AppError");

exports.getAll = async (req, res, next) => {
	try {
		const donations = await prisma.donation.findMany({
			orderBy: { createdAt: "desc" },
			include: { campaign: { select: { title: true } } },
		});
		res.status(200).json({ success: true, data: donations });
	} catch (error) {
		next(error);
	}
};

exports.getOne = async (req, res, next) => {
	try {
		const donation = await prisma.donation.findUnique({
			where: { id: req.params.id },
			include: { campaign: { select: { title: true } } },
		});
		if (!donation) throw new AppError("Donation not found", 404);
		res.status(200).json({ success: true, data: donation });
	} catch (error) {
		next(error);
	}
};

exports.updateStatus = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { status, receiptUrl } = req.body;
		const validStatuses = ["pending", "approved", "rejected"];
		if (status && !validStatuses.includes(status)) {
			throw new AppError("Invalid status", 400);
		}

		const donation = await prisma.donation.findUnique({ where: { id } });
		if (!donation) throw new AppError("Donation not found", 404);

		const updated = await prisma.donation.update({
			where: { id },
			data: {
				...(status && { status }),
				...(receiptUrl !== undefined && { receiptUrl }),
			},
		});
		res.status(200).json({ success: true, data: updated });
	} catch (error) {
		next(error);
	}
};

exports.getReceipt = async (req, res, next) => {
	try {
		const donation = await prisma.donation.findUnique({
			where: { id: req.params.id },
			include: { campaign: { select: { title: true } } },
		});
		if (!donation) throw new AppError("Donation not found", 404);
		// For now, return donation data as receipt (can be enhanced to generate PDF later)
		res.status(200).json({ success: true, data: donation });
	} catch (error) {
		next(error);
	}
};