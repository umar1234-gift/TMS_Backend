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

const resolvedPort = process.env.PORT || 5000;

// Log raw and resolved PORT values, plus status of required env vars, so any
// mismatch between what Railway expects and what we actually bind to is
// visible in the logs instead of failing silently.
console.log("🔎 [env.js] Raw process.env.PORT:", process.env.PORT);
console.log("🔎 [env.js] Resolved port value:", resolvedPort);
console.log("🔎 [env.js] Required env vars status:");
requiredVars.forEach((varName) => {
	console.log(`   - ${varName}: ${process.env[varName] ? "SET" : "MISSING"}`);
});
console.log(
	"🔎 [env.js] Optional Cloudinary vars set:",
	Boolean(
		process.env.CLOUDINARY_CLOUD_NAME &&
			process.env.CLOUDINARY_API_KEY &&
			process.env.CLOUDINARY_API_SECRET,
	),
);

module.exports = {
	port: resolvedPort,
	nodeEnv: process.env.NODE_ENV || "development",
	databaseUrl: process.env.DATABASE_URL,
	jwtSecret: process.env.JWT_SECRET,
	jwtExpire: process.env.JWT_EXPIRE || "30d",
	maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
	uploadPath: process.env.UPLOAD_PATH || "uploads", // kept for backward compatibility
};