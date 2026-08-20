import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let dbUrl = process.env.DATABASE_URL;

if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    try {
      const bundledDbPath = path.join(process.cwd(), 'dev.db');
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
      }
    } catch (e) {
      console.error('Failed to setup sqlite db', e);
    }
  }
  dbUrl = `file:${tmpDbPath}`;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
