import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { connectedId } = body

    if (!connectedId) {
      return NextResponse.json({ error: "connectedId is required" }, { status: 400 })
    }

    if (connectedId === userId) {
      return NextResponse.json({ error: "Cannot connect to yourself" }, { status: 400 })
    }

    // Check if connection already exists
    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { userId, connectedId },
          { userId: connectedId, connectedId: userId },
        ],
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Connection already exists" }, { status: 400 })
    }

    const connection = await prisma.connection.create({
      data: {
        userId,
        connectedId,
        status: "PENDING",
      },
    })

    return NextResponse.json({ connection }, { status: 201 })
  } catch (error) {
    console.error("Connection error:", error)
    return NextResponse.json({ error: "Failed to send connection request" }, { status: 500 })
  }
}
