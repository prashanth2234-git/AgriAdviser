import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import { env } from '../config/env';

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface DbClient {
  query: <T = any>(text: string, params?: any[]) => Promise<QueryResult<T>>;
}

let pgPool: pg.Pool | null = null;
let pgliteDb: PGlite | null = null;
let isInitialized = false;

export async function getDb(): Promise<{
  query: <T = any>(text: string, params?: any[]) => Promise<QueryResult<T>>;
  transaction: <T = any>(cb: (client: DbClient) => Promise<T>) => Promise<T>;
}> {
  if (!isInitialized) {
    await initDb();
  }

  if (pgPool) {
    return {
      query: async <T = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
        const res = await pgPool!.query(text, params);
        return { rows: res.rows as T[], rowCount: res.rowCount ?? res.rows.length };
      },
      transaction: async <T = any>(cb: (client: DbClient) => Promise<T>): Promise<T> => {
        const client = await pgPool!.connect();
        try {
          await client.query('BEGIN');
          const dbClient: DbClient = {
            query: async <R = any>(text: string, params?: any[]): Promise<QueryResult<R>> => {
              const res = await client.query(text, params);
              return { rows: res.rows as R[], rowCount: res.rowCount ?? res.rows.length };
            },
          };
          const result = await cb(dbClient);
          await client.query('COMMIT');
          return result;
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      },
    };
  } else if (pgliteDb) {
    return {
      query: async <T = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
        const res = await pgliteDb!.query(text, params);
        return { rows: res.rows as T[], rowCount: res.rows.length };
      },
      transaction: async <T = any>(cb: (client: DbClient) => Promise<T>): Promise<T> => {
        return await pgliteDb!.transaction(async (tx) => {
          const dbClient: DbClient = {
            query: async <R = any>(text: string, params?: any[]): Promise<QueryResult<R>> => {
              const res = await tx.query(text, params);
              return { rows: res.rows as R[], rowCount: res.rows.length };
            },
          };
          return await cb(dbClient);
        });
      },
    };
  }

  throw new Error('Database is not initialized');
}

export async function initDb(): Promise<void> {
  if (isInitialized) return;

  if (env.DATABASE_URL && env.DATABASE_URL.trim().length > 0) {
    console.log('[DB] Connecting to PostgreSQL at:', env.DATABASE_URL.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@'));
    pgPool = new pg.Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
    });

    // Test connection
    const client = await pgPool.connect();
    client.release();
    console.log('[DB] Connected to PostgreSQL successfully.');
  } else {
    // Embedded PostgreSQL via PGlite
    // Ensure data directory is always in <project_root>/database/data
    const projectRoot = path.resolve(__dirname, '../../..');
    const dataDir = path.resolve(projectRoot, 'database/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    } else {
      const pidFile = path.resolve(dataDir, 'postmaster.pid');
      if (fs.existsSync(pidFile)) {
        try {
          fs.unlinkSync(pidFile);
        } catch {
          // ignore
        }
      }
    }
    console.log('[DB] Using embedded PostgreSQL (PGlite) with storage at:', dataDir);
    pgliteDb = new PGlite(dataDir);
    await pgliteDb.waitReady;
    console.log('[DB] Embedded PostgreSQL ready.');
  }

  // Run migration schema to ensure tables and indexes exist
  await runInitialMigration();
  isInitialized = true;
}

async function runInitialMigration() {
  const projectRoot = path.resolve(__dirname, '../../..');
  const migrationPaths = [
    path.resolve(projectRoot, 'database/migrations/001_initial_schema.sql'),
    path.resolve(__dirname, '../../../database/migrations/001_initial_schema.sql'),
    path.resolve(process.cwd(), 'database/migrations/001_initial_schema.sql'),
  ];

  let migrationSql = '';
  for (const p of migrationPaths) {
    if (fs.existsSync(p)) {
      migrationSql = fs.readFileSync(p, 'utf-8');
      break;
    }
  }

  if (!migrationSql) {
    console.warn('[DB] Warning: Migration file not found in searched paths. Skipping migration.');
    return;
  }

  console.log('[DB] Executing initial database schema migration...');
  if (pgPool) {
    await pgPool.query(migrationSql);
  } else if (pgliteDb) {
    await pgliteDb.exec(migrationSql);
  }
  console.log('[DB] Database migration completed successfully.');
}

export async function closeDb(): Promise<void> {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
  if (pgliteDb) {
    await pgliteDb.close();
    pgliteDb = null;
  }
  isInitialized = false;
  console.log('[DB] Database connection closed.');
}
