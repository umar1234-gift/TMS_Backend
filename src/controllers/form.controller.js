const prisma = require('../config/database');
const AppError = require('../utils/AppError');

// Donation submission
exports.submitDonation = async (req, res, next) => {
  try {
    const { amount, donorName, email, phone, category, campaignId, message } = req.body;
    if (!amount || !donorName || !email || !category) {
      throw new AppError('Missing required fields', 400);
    }
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        donorName,
        email,
        phone,
        category,
        campaignId: campaignId || null,
        message,
      },
    });
    res.status(201).json({ success: true, data: donation });
  } catch (error) { next(error); }
};

// Volunteer registration
exports.submitVolunteer = async (req, res, next) => {
  try {
    const { name, email, phone, skills, availability, message } = req.body;
    if (!name || !email) throw new AppError('Name and email are required', 400);
    const volunteer = await prisma.volunteer.create({
      data: { name, email, phone, skills, availability, message },
    });
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) { next(error); }
};

// Contact form
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) throw new AppError('Name, email and message are required', 400);
    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });
    res.status(201).json({ success: true, data: contact });
  } catch (error) { next(error); }
};