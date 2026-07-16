const AppError = require('../utils/AppError');

const handleValidationError = (err) => {
  const messages = err.errors?.map((e) => e.message).join(', ') || 'Validation failed';
  return new AppError(messages, 400);
};

const handlePrismaKnownError = (err) => {
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'field';
    return new AppError(`Duplicate value for ${field}`, 400);
  }
  return new AppError('Database error', 500);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // Log full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err);
  }

  // Prisma validation error
  if (err.name === 'PrismaClientValidationError') {
    error = handleValidationError(err);
  }

  // Prisma known request error (e.g., unique constraint)
  if (err.name === 'PrismaClientKnownRequestError') {
    error = handlePrismaKnownError(err);
  }

  // JWT errors (will be handled later, just a placeholder)
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File too large. Maximum size allowed is 5MB.', 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;