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
    const { content, postType } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        userId,
        content: content.trim(),
        postType: postType || "TEXT",
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
