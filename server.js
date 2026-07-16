const app = require('./src/app');
const { port, nodeEnv, databaseUrl } = require('./src/config/env');
const prisma = require('./src/config/database');

// Start server only after database connection is established
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(port, () => {
      console.log(`🚀 Server running in ${nodeEnv} mode on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }
}

startServer();