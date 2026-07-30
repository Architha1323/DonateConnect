import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Remove pgbouncer param as pg driver doesn't need it
let connectionString = `${process.env.DATABASE_URL}`;
if (connectionString.includes('?pgbouncer=true')) connectionString = connectionString.replace('?pgbouncer=true', '');
if (connectionString.includes('&pgbouncer=true')) connectionString = connectionString.replace('&pgbouncer=true', '');

const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 2, 
  idleTimeoutMillis: 10000, 
  allowExitOnIdle: true, 
  ssl: connectionString?.includes('localhost') ? false : { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
