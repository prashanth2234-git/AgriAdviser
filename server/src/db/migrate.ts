import { initDb } from './index';

async function run() {
  try {
    console.log('[MIGRATE] Running database migrations...');
    await initDb();
    console.log('[MIGRATE] Migration process finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[MIGRATE] Error running migrations:', error);
    process.exit(1);
  }
}

run();
