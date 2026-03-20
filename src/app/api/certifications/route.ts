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
    const { name, issuer, credentialNumber, issueDate, expirationDate, ceCredits } = body

    if (!name || !issuer || !issueDate) {
      return NextResponse.json(
        { error: "Name, issuer, and issue date are required" },
        { status: 400 }
      )
    }

    const certification = await prisma.certification.create({
      data: {
        userId,
        name,
        issuer,
        credentialNumber: credentialNumber || null,
        issueDate: new Date(issueDate),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        ceCredits: ceCredits ? parseFloat(ceCredits) : 0,
        status: "ACTIVE",
      },
    })

    return NextResponse.json({ certification }, { status: 201 })
  } catch (error) {
    console.error("Certification creation error:", error)
    return NextResponse.json({ error: "Failed to add certification" }, { status: 500 })
  }
}
