const { PrismaClient } = require('@prisma/client');

// Neon's connection pooler aggressively closes idle connections. Prisma's
// pool/connection behavior can be tuned via query parameters on the
// connection string, so we append sensible defaults here (without
// overriding anything the operator has already configured explicitly via
// DATABASE_URL) rather than requiring the DATABASE_URL variable itself to
// be edited.
function buildDatasourceUrl(rawUrl) {
  if (!rawUrl) {
    return rawUrl;
  }

  let url;
  try {
    url = new URL(rawUrl);
  } catch (error) {
    console.warn('⚠️  Could not parse DATABASE_URL to tune connection pool settings:', error.message);
    return rawUrl;
  }

  const defaults = {
    // Keep Prisma's own connection pool small and short-lived so that we
    // don't hold connections open long enough for Neon's pooler to kill
    // them out from under us.
    connection_limit: '5',
    pool_timeout: '10',
    // How long to wait when opening a new connection.
    connect_timeout: '10',
    // Neon's pgbouncer-based pooler requires statement caching to be
    // disabled when connecting through the pooled endpoint.
    pgbouncer: 'true',
  };

  Object.entries(defaults).forEach(([key, value]) => {
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

const datasourceUrl = buildDatasourceUrl(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: datasourceUrl,
    },
  },
});

// Neon closes idle connections after ~50s of inactivity. Ping the database
// periodically to keep the underlying connection alive, and transparently
// reconnect if the keep-alive query reveals the connection has already been
// dropped.
const KEEP_ALIVE_INTERVAL_MS = 30_000;
let keepAliveTimer = null;

function startKeepAlive() {
  if (keepAliveTimer) {
    return;
  }

  keepAliveTimer = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error('⚠️  Database keep-alive check failed, attempting to reconnect:', error.message);

      try {
        await prisma.$disconnect();
        await prisma.$connect();
        console.log('✅ Database reconnected successfully after keep-alive failure');
      } catch (reconnectError) {
        console.error('❌ Failed to reconnect to database after keep-alive failure:', reconnectError.message);
      }
    }
  }, KEEP_ALIVE_INTERVAL_MS);

  // Don't let the keep-alive timer keep the process alive on its own.
  if (typeof keepAliveTimer.unref === 'function') {
    keepAliveTimer.unref();
  }
}

startKeepAlive();

process.on('beforeExit', () => {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
});

module.exports = prisma;