const dotenv = require("dotenv");
dotenv.config();

const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

requiredVars.forEach((varName) => {
	if (!process.env[varName]) {
		throw new Error(`Missing required environment variable: ${varName}`);
	}
});

// Optional Cloudinary check (warning only)
if (
	!process.env.CLOUDINARY_CLOUD_NAME ||
	!process.env.CLOUDINARY_API_KEY ||
	!process.env.CLOUDINARY_API_SECRET
) {
	console.warn(
		"⚠️  Cloudinary credentials not set. Image upload will not work.",
	);
}

module.exports = {
	port: process.env.PORT || 5000,
	nodeEnv: process.env.NODE_ENV || "development",
	databaseUrl: process.env.DATABASE_URL,
	jwtSecret: process.env.JWT_SECRET,
	jwtExpire: process.env.JWT_EXPIRE || "30d",
	maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
	uploadPath: process.env.UPLOAD_PATH || "uploads", // kept for backward compatibility
};