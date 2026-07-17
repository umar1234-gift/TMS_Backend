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
  // Detailed diagnostic logging before we attempt to connect/listen, so a
  // mismatch between the expected port and the actual bound port shows up
  // in the logs instead of the server silently failing to accept connections.
  console.log('🔎 [server.js] NODE_ENV:', process.env.NODE_ENV);
  console.log('🔎 [server.js] Raw process.env.PORT:', process.env.PORT);
  console.log('🔎 [server.js] Resolved port (from env.js):', port);
  console.log(
    '🔎 [server.js] Attempting DATABASE_URL connection:',
    databaseUrl ? databaseUrl.replace(/:\/\/.*@/, '://***:***@') : 'NOT SET'
  );

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    console.log(`🔎 [server.js] Calling app.listen() on port ${port}...`);

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running in ${nodeEnv} mode on port ${port}`);
      console.log(`✅ Successfully listening on port ${port}`);
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
