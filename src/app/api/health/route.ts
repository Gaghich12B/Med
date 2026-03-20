import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/health
 *
 * Diagnostic endpoint. Returns a JSON payload with:
 *  - overall status ("ok" | "degraded")
 *  - database connectivity status and latency
 *  - whether the DATABASE_URL env var is present
 *
 * This endpoint does NOT require authentication so it is useful for
 * diagnosing deployment problems.
 */
export async function GET() {
  const hasDbUrl = Boolean(process.env.DATABASE_URL)
  const start = Date.now()
  let dbStatus: "ok" | "error" = "error"
  let dbMessage = ""

  if (!hasDbUrl) {
    dbMessage = "DATABASE_URL environment variable is not set"
  } else {
    try {
      // A cheap query to verify the connection
      await prisma.$queryRaw`SELECT 1`
      dbStatus = "ok"
      dbMessage = `Connected (${Date.now() - start} ms)`
    } catch (err) {
      dbMessage =
        err instanceof Error
          ? err.message.slice(0, 200)
          : "Unknown error"
    }
  }

  const overall = dbStatus === "ok" ? "ok" : "degraded"

  return NextResponse.json(
    {
      status: overall,
      database: {
        status: dbStatus,
        message: dbMessage,
        urlConfigured: hasDbUrl,
      },
      timestamp: new Date().toISOString(),
    },
    { status: overall === "ok" ? 200 : 503 }
  )
}
