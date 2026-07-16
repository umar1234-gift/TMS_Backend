const express = require("express");
const blogController = require("../controllers/blog.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");
const { validate } = require("../middlewares/validator");
const {
	categoryCreateValidator,
	categoryUpdateValidator,
	postCreateValidator,
	postUpdateValidator,
} = require("../validators/blog.validator");

const router = express.Router();
router.use(authMiddleware);

// Category routes
router.get("/categories", blogController.getAllCategories);
router.post(
	"/categories",
	categoryCreateValidator,
	validate,
	blogController.createCategory,
);
router.put(
	"/categories/:id",
	categoryUpdateValidator,
	validate,
	blogController.updateCategory,
);
router.delete("/categories/:id", blogController.deleteCategory);

// Post routes
router.get("/posts", blogController.getAllPosts);
router.get("/posts/:id", blogController.getPost);
router.post(
	"/posts",
	upload.single("featuredImage"),
	postCreateValidator,
	validate,
	blogController.createPost,
);
router.put(
	"/posts/:id",
	upload.single("featuredImage"),
	postUpdateValidator,
	validate,
	blogController.updatePost,
);
router.delete("/posts/:id", blogController.deletePost);

module.exports = router;