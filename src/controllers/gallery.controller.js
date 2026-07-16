const prisma = require("../config/database");
const AppError = require("../utils/AppError");

// ---------- Albums ----------
exports.getAllAlbums = async (req, res, next) => {
	try {
		const albums = await prisma.galleryAlbum.findMany({
			include: { _count: { select: { images: true } } },
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json({ success: true, data: albums });
	} catch (error) {
		next(error);
	}
};

exports.getAlbum = async (req, res, next) => {
	try {
		const album = await prisma.galleryAlbum.findUnique({
			where: { id: req.params.id },
			include: { images: { orderBy: { createdAt: "asc" } } },
		});
		if (!album) throw new AppError("Album not found", 404);
		res.status(200).json({ success: true, data: album });
	} catch (error) {
		next(error);
	}
};

exports.createAlbum = async (req, res, next) => {
	try {
		const { title, description } = req.body;
		const coverImage = req.file ? req.file.path : null;

		const album = await prisma.galleryAlbum.create({
			data: { title, description, coverImage },
		});
		res.status(201).json({ success: true, data: album });
	} catch (error) {
		next(error);
	}
};

exports.updateAlbum = async (req, res, next) => {
	try {
		const album = await prisma.galleryAlbum.findUnique({
			where: { id: req.params.id },
		});
		if (!album) throw new AppError("Album not found", 404);

		const { title, description } = req.body;
		let coverImage = album.coverImage;

		if (req.file) {
			coverImage = req.file.path; // new Cloudinary URL
		}

		const updated = await prisma.galleryAlbum.update({
			where: { id: album.id },
			data: {
				...(title && { title }),
				...(description !== undefined && { description }),
				coverImage,
			},
		});
		res.status(200).json({ success: true, data: updated });
	} catch (error) {
		next(error);
	}
};

exports.deleteAlbum = async (req, res, next) => {
	try {
		const album = await prisma.galleryAlbum.findUnique({
			where: { id: req.params.id },
			include: { images: true },
		});
		if (!album) throw new AppError("Album not found", 404);

		// DB cascade deletes images, we do not delete Cloudinary files automatically
		await prisma.galleryAlbum.delete({ where: { id: album.id } });
		res
			.status(200)
			.json({ success: true, message: "Album and all images deleted" });
	} catch (error) {
		next(error);
	}
};

// ---------- Images ----------
exports.uploadImages = async (req, res, next) => {
	try {
		const albumId = req.params.albumId;
		const album = await prisma.galleryAlbum.findUnique({
			where: { id: albumId },
		});
		if (!album) throw new AppError("Album not found", 404);

		const files = req.files;
		if (!files || files.length === 0) {
			throw new AppError("Please upload at least one image", 400);
		}

		const images = await Promise.all(
			files.map(async (file) => {
				return prisma.galleryImage.create({
					data: {
						albumId,
						image: file.path, // Cloudinary URL
						caption: req.body.captions?.[file.originalname] || null,
					},
				});
			}),
		);

		res.status(201).json({ success: true, data: images });
	} catch (error) {
		next(error);
	}
};

exports.deleteImage = async (req, res, next) => {
	try {
		const image = await prisma.galleryImage.findUnique({
			where: { id: req.params.imageId },
		});
		if (!image) throw new AppError("Image not found", 404);

		await prisma.galleryImage.delete({ where: { id: image.id } });
		res.status(200).json({ success: true, message: "Image deleted" });
	} catch (error) {
		next(error);
	}
};