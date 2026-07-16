const express = require("express");
const galleryController = require("../controllers/gallery.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");
const { validate } = require("../middlewares/validator");
const {
	albumCreateValidator,
	albumUpdateValidator,
} = require("../validators/gallery.validator");

const router = express.Router();
router.use(authMiddleware);

// Album routes
router.get("/albums", galleryController.getAllAlbums);
router.get("/albums/:id", galleryController.getAlbum);
router.post(
	"/albums",
	upload.single("coverImage"),
	albumCreateValidator,
	validate,
	galleryController.createAlbum,
);
router.put(
	"/albums/:id",
	upload.single("coverImage"),
	albumUpdateValidator,
	validate,
	galleryController.updateAlbum,
);
router.delete("/albums/:id", galleryController.deleteAlbum);

// Image routes (within an album)
router.post(
	"/albums/:albumId/images",
	upload.array("images", 10),
	galleryController.uploadImages,
);
router.delete("/images/:imageId", galleryController.deleteImage);

module.exports = router;