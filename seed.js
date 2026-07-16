const bcrypt = require("bcrypt");
const prisma = require("./src/config/database");
require("dotenv").config();

async function seedAdmin() {
	const adminEmail = process.env.ADMIN_EMAIL || "admin@umeedtrust.org";
	const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

	const existingAdmin = await prisma.admin.findUnique({
		where: { email: adminEmail },
	});
	if (existingAdmin) {
		console.log("⚠️  Admin already exists. Skipping admin creation.");
	} else {
		const hashedPassword = await bcrypt.hash(adminPassword, 12);
		await prisma.admin.create({
			data: {
				email: adminEmail,
				password: hashedPassword,
				name: "Super Admin",
			},
		});
		console.log("✅ Admin seeded successfully.");
		console.log(`   Email: ${adminEmail}`);
		console.log(`   Password: ${adminPassword}`);
	}
}

async function seedSettings() {
	const defaultSettings = [
		{ key: "site_name", value: "Umeed Trust" },
		{
			key: "site_description",
			value: "Bringing hope through charity and community service.",
		},
		{ key: "contact_email", value: "info@umeedtrust.org" },
		{ key: "contact_phone", value: "+92 300 1234567" },
		{ key: "contact_address", value: "123 Hope Street, Lahore, Pakistan" },
		{ key: "social_facebook", value: "https://facebook.com/umeedtrust" },
		{ key: "social_twitter", value: "https://twitter.com/umeedtrust" },
		{ key: "social_youtube", value: "https://youtube.com/@umeedtrust" },
		{ key: "logo_url", value: "" },
	];

	for (const setting of defaultSettings) {
		await prisma.siteSetting.upsert({
			where: { key: setting.key },
			update: {},
			create: setting,
		});
	}
	console.log("✅ Default site settings seeded.");
}

async function main() {
	await prisma.$connect();
	await seedAdmin();
	await seedSettings();
	await prisma.$disconnect();
}

main().catch((e) => {
	console.error("❌ Seeding failed:", e);
	prisma.$disconnect();
	process.exit(1);
});