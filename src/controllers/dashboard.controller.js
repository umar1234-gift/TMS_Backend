const prisma = require("../config/database");

exports.getStats = async (req, res, next) => {
	try {
		const [
			totalDonations,
			totalCampaigns,
			totalVolunteers,
			totalMessages,
			recentDonations,
			recentMessages,
		] = await Promise.all([
			prisma.donation.count(),
			prisma.campaign.count(),
			prisma.volunteer.count(),
			prisma.contactMessage.count(),
			prisma.donation.findMany({
				take: 5,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					donorName: true,
					amount: true,
					category: true,
					status: true,
					createdAt: true,
				},
			}),
			prisma.contactMessage.findMany({
				take: 5,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					name: true,
					subject: true,
					read: true,
					createdAt: true,
				},
			}),
		]);

		res.status(200).json({
			success: true,
			data: {
				totalDonations,
				totalCampaigns,
				totalVolunteers,
				totalMessages,
				recentDonations,
				recentMessages,
			},
		});
	} catch (error) {
		next(error);
	}
};