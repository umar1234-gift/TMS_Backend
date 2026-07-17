const app = require('./src/app');
const { port, nodeEnv, databaseUrl } = require('./src/config/env');
const prisma = require('./src/config/database');

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// Start server only after database connection is established
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running in ${nodeEnv} mode on port ${port}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

startServer();
