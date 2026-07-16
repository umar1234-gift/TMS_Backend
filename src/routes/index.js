const express = require("express");
const router = express.Router();

// ---------- Health Check ----------
router.get("/health", (req, res) => {
	res.status(200).json({ success: true, message: "Server is running" });
});

// ========== AUTH ROUTES (public + protected) ==========
const authRoutes = require("./auth.routes");
router.use("/api/v1/admin", authRoutes); // login, profile, change-password

// ========== PROTECTED ADMIN RESOURCE ROUTES ==========
const campaignRoutes = require("./campaign.routes");
const programRoutes = require("./program.routes");
const blogRoutes = require("./blog.routes");
const galleryRoutes = require("./gallery.routes");
const donationRoutes = require("./donation.routes");
const volunteerRoutes = require("./volunteer.routes");
const contactRoutes = require("./contact.routes");
const settingRoutes = require("./setting.routes");
const dashboardRoutes = require("./dashboard.routes");
const testimonialRoutes = require("./testimonial.routes");
const faqAdminRoutes = require("./faq.routes");

router.use("/api/v1/admin/campaigns", campaignRoutes);
router.use("/api/v1/admin/programs", programRoutes);
router.use("/api/v1/admin/blog", blogRoutes);
router.use("/api/v1/admin/gallery", galleryRoutes);
router.use("/api/v1/admin/donations", donationRoutes);
router.use("/api/v1/admin/volunteers", volunteerRoutes);
router.use("/api/v1/admin/contacts", contactRoutes);
router.use("/api/v1/admin/settings", settingRoutes);
router.use("/api/v1/admin/dashboard", dashboardRoutes);
router.use("/api/v1/admin/testimonials", testimonialRoutes);
router.use("/api/v1/admin/faqs", faqAdminRoutes);

// ========== PUBLIC WEBSITE ROUTES ==========
const publicController = require("../controllers/public.controller");
const formController = require("../controllers/form.controller");
const { validate } = require("../middlewares/validator");
const {
	donationValidator,
	volunteerValidator,
	contactValidator,
} = require("../validators/form.validator");

// Campaigns
router.get("/api/v1/campaigns", publicController.getCampaigns);
router.get("/api/v1/campaigns/:slug", publicController.getCampaignBySlug);

// Programs
router.get("/api/v1/programs", publicController.getPrograms);
router.get("/api/v1/programs/:slug", publicController.getProgramBySlug);

// Blog
router.get("/api/v1/blog", publicController.getBlogPosts);
router.get("/api/v1/blog/:slug", publicController.getBlogPostBySlug);

// Gallery
router.get("/api/v1/gallery/albums", publicController.getAlbums);
router.get(
	"/api/v1/gallery/albums/:id/images",
	publicController.getAlbumWithImages,
);

// Testimonials (public)
router.get("/api/v1/testimonials", publicController.getTestimonials);

// FAQs (public)
router.get("/api/v1/faqs", publicController.getFaqs);

// Site Settings (public)
router.get("/api/v1/settings/public", publicController.getPublicSettings);

// Public Forms
router.post(
	"/api/v1/donations",
	donationValidator,
	validate,
	formController.submitDonation,
);
router.post(
	"/api/v1/volunteers",
	volunteerValidator,
	validate,
	formController.submitVolunteer,
);
router.post(
	"/api/v1/contact",
	contactValidator,
	validate,
	formController.submitContact,
);

module.exports = router;