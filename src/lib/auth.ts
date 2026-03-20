import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"

function isTransientDbError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientInitializationError ||
    (err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P1001" || err.code === "P1002"))
  )
}

async function findUserWithRetry(email: string) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      })
    } catch (err) {
      if (isTransientDbError(err) && attempt === 0) {
        // Neon free-tier computes auto-pause after ~5 min of inactivity and
        // take 3-5 s to wake up. Retry once after 2 s so the first cold-start
        // request doesn't fail outright.
        await new Promise((resolve) => setTimeout(resolve, 2000))
        continue
      }
      throw err
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        try {
          const user = await findUserWithRetry(credentials.email)

          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isCorrectPassword) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          if (isTransientDbError(error)) {
            const message =
              error instanceof Error ? error.message : String(error)
            if (message.includes("Environment variable not found: DATABASE_URL")) {
              throw new Error("Database not configured")
            }
            throw new Error("Service temporarily unavailable")
          }
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
