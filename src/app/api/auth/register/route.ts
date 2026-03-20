import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"

const PRISMA_UNIQUE_CONSTRAINT_VIOLATION = "P2002"

/** Returns a human-readable 503 response for Prisma init / connection errors. */
function dbErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes("Environment variable not found: DATABASE_URL")) {
    return NextResponse.json(
      {
        error:
          "Database not configured. Set DATABASE_URL in your Vercel project's Environment Variables and redeploy.",
      },
      { status: 503 }
    )
  }

  return NextResponse.json(
    {
      error:
        "Unable to connect to the database. Please try again in a moment — the database may be waking up.",
    },
    { status: 503 }
  )
}

type CreateUserResult =
  | { conflict: true }
  | { conflict: false; user: { id: string; email: string; name: string | null; role: string } }

async function createUser(
  email: string,
  password: string,
  name: string | null,
  role: string
): Promise<CreateUserResult> {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) return { conflict: true }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name: name || null, role: role || "NURSE" },
  })

  await prisma.profile.create({ data: { userId: user.id } })

  return {
    conflict: false,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  }
}

function isTransientDbError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientInitializationError ||
    (err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P1001" || err.code === "P1002"))
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    let result: CreateUserResult | null = null
    let lastError: unknown = null

    // Attempt the DB operation; on a transient connection error, retry once
    // after 2 s (gives Neon free-tier computes time to wake from auto-pause).
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        result = await createUser(email, password, name, role)
        lastError = null
        break
      } catch (err) {
        lastError = err
        if (isTransientDbError(err) && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          continue
        }
        break
      }
    }

    if (lastError !== null) {
      console.error("Registration error:", lastError)

      if (isTransientDbError(lastError)) {
        return dbErrorResponse(lastError)
      }

      if (
        lastError instanceof Prisma.PrismaClientKnownRequestError &&
        lastError.code === PRISMA_UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 400 }
        )
      }

      return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }

    if (result === null) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }

    if (result.conflict) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      )
    }

    return NextResponse.json({ user: result.user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return dbErrorResponse(error)
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_UNIQUE_CONSTRAINT_VIOLATION
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
