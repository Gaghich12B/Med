import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fallback to DATABASE_URL when DATABASE_URL_UNPOOLED is not configured
if (!process.env.DATABASE_URL_UNPOOLED && process.env.DATABASE_URL) {
  process.env.DATABASE_URL_UNPOOLED = process.env.DATABASE_URL
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

globalForPrisma.prisma = prisma