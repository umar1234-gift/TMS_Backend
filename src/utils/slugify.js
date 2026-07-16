/**
 * Convert a string to a URL-friendly slug.
 */
function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w\-]+/g, "") // Remove all non-word chars
		.replace(/\-\-+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start
		.replace(/-+$/, ""); // Trim - from end
}

/**
 * Generate a unique slug by appending a number if the slug already exists.
 * @param {string} baseSlug
 * @param {object} prismaModel - Prisma model delegate (e.g., prisma.campaign)
 * @param {string} field - Slug field name (usually 'slug')
 * @param {string} [excludeId] - Optional ID to exclude from uniqueness check (for updates)
 * @returns {Promise<string>}
 */
async function generateUniqueSlug(
	baseSlug,
	prismaModel,
	field = "slug",
	excludeId = null,
) {
	let slug = baseSlug;
	let counter = 1;

	while (true) {
		const where = { [field]: slug };
		const existing = await prismaModel.findFirst({ where });
		if (!existing || (excludeId && existing.id === excludeId)) {
			break;
		}
		slug = `${baseSlug}-${counter}`;
		counter++;
	}

	return slug;
}

module.exports = { slugify, generateUniqueSlug };