import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Builds a DATABASE_URL with connection-timeout parameters appended.
 * This ensures Neon free-tier computes (which auto-pause and can take 3-5 s
 * to wake up) don't hit Prisma's 5-second default connect timeout.
 */
function buildDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return url

  try {
    const parsed = new URL(url)
    if (!parsed.searchParams.has('connect_timeout')) {
      parsed.searchParams.set('connect_timeout', '30')
    }
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '30')
    }
    return parsed.toString()
  } catch {
    // If URL parsing fails, return as-is
    return url
  }
}

const createPrismaClient = () =>
  new PrismaClient({
    datasources: {
      db: { url: buildDatabaseUrl() },
    },
  })

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma