import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// For Vercel preview/production deployments, auto-detect NEXTAUTH_URL from VERCEL_URL
// so that CSRF token validation works on every deployment URL.
if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }