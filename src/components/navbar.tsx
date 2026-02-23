'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Healthcare Platform
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <button className="hover:text-blue-600">Dashboard</button>
              </Link>
              <Link href="/courses">
                <button className="hover:text-blue-600">Courses</button>
              </Link>
              <Link href="/certifications">
                <button className="hover:text-blue-600">Certifications</button>
              </Link>
              <Link href="/course-finder">
                <button className="hover:text-blue-600">Course Finder</button>
              </Link>
              <Link href="/references">
                <button className="hover:text-blue-600">References</button>
              </Link>
              <Link href="/network">
                <button className="hover:text-blue-600">Network</button>
              </Link>
              <Link href="/feed">
                <button className="hover:text-blue-600">Feed</button>
              </Link>
              <Link href="/profile">
                <button className="hover:text-blue-600">Profile</button>
              </Link>
              <button onClick={() => signOut()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <button className="hover:text-blue-600">Sign In</button>
              </Link>
              <Link href="/auth/signup">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
