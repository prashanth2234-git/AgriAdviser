import { createApp } from './app';
import { env } from './config/env';
import { initDb, closeDb } from './db';

async function bootstrap() {
  try {
    console.log('[STARTUP] Initializing database...');
    await initDb();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`===================================================`);
      console.log(`🌾 AI Agriculture Crop Advisory Assistant Server`);
      console.log(`📡 Server listening on http://localhost:${env.PORT}`);
      console.log(`🔒 Environment: ${env.NODE_ENV}`);
      console.log(`🤖 Gemini AI Model: ${env.GEMINI_MODEL}`);
      console.log(`🌐 Allowed Client URL: ${env.CLIENT_URL}`);
      console.log(`===================================================`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[SHUTDOWN] Received ${signal}. Closing server gracefully...`);
      server.close(async () => {
        await closeDb();
        console.log('[SHUTDOWN] HTTP server and DB closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[STARTUP] Fatal error during startup:', error);
    process.exit(1);
  }
}

bootstrap();
