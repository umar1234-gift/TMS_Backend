const prisma = require("../config/database");
const AppError = require("../utils/AppError");
const { slugify, generateUniqueSlug } = require("../utils/slugify");

// ---------- Categories ----------
exports.getAllCategories = async (req, res, next) => {
	try {
		const categories = await prisma.blogCategory.findMany({
			orderBy: { name: "asc" },
		});
		res.status(200).json({ success: true, data: categories });
	} catch (error) {
		next(error);
	}
};

exports.createCategory = async (req, res, next) => {
	try {
		const { name } = req.body;
		const baseSlug = slugify(name);
		const slug = await generateUniqueSlug(baseSlug, prisma.blogCategory);
		const category = await prisma.blogCategory.create({ data: { name, slug } });
		res.status(201).json({ success: true, data: category });
	} catch (error) {
		next(error);
	}
};

exports.updateCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name } = req.body;
		const category = await prisma.blogCategory.findUnique({ where: { id } });
		if (!category) throw new AppError("Category not found", 404);

		let slug = category.slug;
		if (name && name !== category.name) {
			const baseSlug = slugify(name);
			slug = await generateUniqueSlug(
				baseSlug,
				prisma.blogCategory,
				"slug",
				id,
			);
		}
		const updated = await prisma.blogCategory.update({
			where: { id },
			data: { ...(name && { name }), slug },
		});
		res.status(200).json({ success: true, data: updated });
	} catch (error) {
		next(error);
	}
};

exports.deleteCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		const category = await prisma.blogCategory.findUnique({ where: { id } });
		if (!category) throw new AppError("Category not found", 404);

		// Set posts in this category to null
		await prisma.blogPost.updateMany({
			where: { categoryId: id },
			data: { categoryId: null },
		});
		await prisma.blogCategory.delete({ where: { id } });
		res.status(200).json({ success: true, message: "Category deleted" });
	} catch (error) {
		next(error);
	}
};

// ---------- Posts ----------
exports.getAllPosts = async (req, res, next) => {
	try {
		const posts = await prisma.blogPost.findMany({
			include: { category: true },
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json({ success: true, data: posts });
	} catch (error) {
		next(error);
	}
};

exports.getPost = async (req, res, next) => {
	try {
		const post = await prisma.blogPost.findUnique({
			where: { id: req.params.id },
			include: { category: true },
		});
		if (!post) throw new AppError("Post not found", 404);
		res.status(200).json({ success: true, data: post });
	} catch (error) {
		next(error);
	}
};

exports.createPost = async (req, res, next) => {
	try {
		const { title, content, excerpt, categoryId, published } = req.body;
		const baseSlug = slugify(title);
		const slug = await generateUniqueSlug(baseSlug, prisma.blogPost);
		const featuredImage = req.file ? req.file.path : null;

		const post = await prisma.blogPost.create({
			data: {
				title,
				slug,
				content,
				excerpt,
				categoryId: categoryId || null,
				published: published === "true" || published === true,
				featuredImage,
			},
			include: { category: true },
		});
		res.status(201).json({ success: true, data: post });
	} catch (error) {
		next(error);
	}
};

exports.updatePost = async (req, res, next) => {
	try {
		const post = await prisma.blogPost.findUnique({
			where: { id: req.params.id },
		});
		if (!post) throw new AppError("Post not found", 404);

		const { title, content, excerpt, categoryId, published } = req.body;
		let slug = post.slug;
		let featuredImage = post.featuredImage;

		if (title && title !== post.title) {
			const baseSlug = slugify(title);
			slug = await generateUniqueSlug(
				baseSlug,
				prisma.blogPost,
				"slug",
				post.id,
			);
		}

		if (req.file) {
			featuredImage = req.file.path; // new Cloudinary URL
		}

		const updated = await prisma.blogPost.update({
			where: { id: post.id },
			data: {
				...(title && { title }),
				slug,
				...(content && { content }),
				...(excerpt !== undefined && { excerpt }),
				categoryId: categoryId !== undefined ? categoryId : post.categoryId,
				published:
					published !== undefined
						? published === "true" || published === true
						: post.published,
				featuredImage,
			},
			include: { category: true },
		});
		res.status(200).json({ success: true, data: updated });
	} catch (error) {
		next(error);
	}
};

exports.deletePost = async (req, res, next) => {
	try {
		const post = await prisma.blogPost.findUnique({
			where: { id: req.params.id },
		});
		if (!post) throw new AppError("Post not found", 404);
		await prisma.blogPost.delete({ where: { id: post.id } });
		res.status(200).json({ success: true, message: "Post deleted" });
	} catch (error) {
		next(error);
	}
};