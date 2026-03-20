import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { id } = params

    // Verify ownership
    const certification = await prisma.certification.findUnique({
      where: { id },
    })

    if (!certification) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (certification.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.certification.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Certification delete error:", error)
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 })
  }
}
