const { body } = require('express-validator');

exports.donationValidator = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('donorName').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('category').notEmpty().withMessage('Donation category is required'),
];

exports.volunteerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
];

exports.contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];