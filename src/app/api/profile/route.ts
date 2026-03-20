import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const {
      name,
      title,
      specialty,
      licenseNumber,
      licenseState,
      bio,
      location,
      phone,
      website,
      linkedin,
    } = body

    // Update user name
    if (name !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      })
    }

    // Upsert profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        title,
        specialty,
        licenseNumber,
        licenseState,
        bio,
        location,
        phone,
        website,
        linkedin,
      },
      update: {
        title,
        specialty,
        licenseNumber,
        licenseState,
        bio,
        location,
        phone,
        website,
        linkedin,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
