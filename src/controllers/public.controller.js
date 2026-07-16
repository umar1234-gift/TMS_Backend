const prisma = require('../config/database');
const AppError = require('../utils/AppError');

// Campaigns (active or featured)
exports.getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: campaigns });
  } catch (error) { next(error); }
};

exports.getCampaignBySlug = async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { slug: req.params.slug } });
    if (!campaign) throw new AppError('Campaign not found', 404);
    res.json({ success: true, data: campaign });
  } catch (error) { next(error); }
};

// Programs
exports.getPrograms = async (req, res, next) => {
  try {
    const programs = await prisma.program.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: programs });
  } catch (error) { next(error); }
};

exports.getProgramBySlug = async (req, res, next) => {
  try {
    const program = await prisma.program.findUnique({ where: { slug: req.params.slug } });
    if (!program) throw new AppError('Program not found', 404);
    res.json({ success: true, data: program });
  } catch (error) { next(error); }
};

// Blog posts (only published)
exports.getBlogPosts = async (req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: posts });
  } catch (error) { next(error); }
};

exports.getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: { category: { select: { name: true, slug: true } } },
    });
    if (!post || !post.published) throw new AppError('Post not found', 404);
    res.json({ success: true, data: post });
  } catch (error) { next(error); }
};

// Gallery – albums and images
exports.getAlbums = async (req, res, next) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: { _count: { select: { images: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: albums });
  } catch (error) { next(error); }
};

exports.getAlbumWithImages = async (req, res, next) => {
  try {
    const album = await prisma.galleryAlbum.findUnique({
      where: { id: req.params.id },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    if (!album) throw new AppError('Album not found', 404);
    res.json({ success: true, data: album });
  } catch (error) { next(error); }
};

// Testimonials (active)
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) { next(error); }
};

// FAQs
exports.getFaqs = async (req, res, next) => {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: faqs });
  } catch (error) { next(error); }
};

// Public settings (selected keys)
exports.getPublicSettings = async (req, res, next) => {
  try {
    const keys = [
      'site_name', 'site_description', 'logo_url', 'contact_email',
      'contact_phone', 'contact_address', 'social_facebook',
      'social_twitter', 'social_youtube'
    ];
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });
    const settingsObj = {};
    settings.forEach((s) => { settingsObj[s.key] = s.value; });
    res.json({ success: true, data: settingsObj });
  } catch (error) { next(error); }
};