const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/AppError");

// Create Cloudinary storage
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "umeed-trust", // All images go to this folder in Cloudinary
		allowed_formats: ["jpg", "jpeg", "png", "webp"],
		transformation: [
			{ width: 1200, height: 1200, crop: "limit", quality: "auto" },
		],
	},
});

// File filter: only images
const fileFilter = (req, file, cb) => {
	const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new AppError("Only .jpeg, .jpg, .png and .webp images are allowed", 400),
			false,
		);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;