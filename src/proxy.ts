import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    '/certifications/:path*',
    '/course-finder/:path*',
    '/references/:path*',
    '/profile/:path*',
    '/network/:path*',
    '/feed/:path*',
    '/messages/:path*',
  ],
};
